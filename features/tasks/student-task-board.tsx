"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanSquare, LayoutDashboard, Loader2, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";

import { statusColumns } from "./mock-data";
import type { Sprint, Task } from "./types";
import {
  isDateOverdue,
  isTaskOverdue,
  mapApiTaskToStatus,
  mapStatusToStatusCategory,
  mapStatusToStatusName,
} from "./utils";
import { TaskBoardHeader } from "./task-board-header";
import { KanbanView } from "./kanban-view";
import { TaskDialog } from "./task-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useTeamSprints } from "@/features/management/teams/hooks/use-team-sprints";
import { useTeamTasks } from "@/features/management/teams/hooks/use-team-tasks";
import { useCreateTask } from "@/features/management/teams/hooks/use-create-task";
import { useUpdateTask } from "@/features/management/teams/hooks/use-update-task";
import { useDeleteTask } from "@/features/management/teams/hooks/use-delete-task";
import { useJiraUsers } from "@/features/management/teams/hooks/use-jira-users";
import { useTeamMembers } from "@/features/student/hooks/use-team-members";
import { useMemberTasks } from "@/features/integration/hooks/use-member-tasks";
import { useTeamAllTasks } from "@/features/integration/hooks/use-team-all-tasks";
import { useMyTasks } from "@/features/integration/hooks/use-my-tasks";
import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import { TaskDetailSheet } from "./task-detail-sheet";
import { useSocket } from "@/components/providers/socket-provider";
import { getTeamAllTasksApi } from "@/features/integration/api/team-all-tasks-api";

export function TaskBoard() {
  const { isConnected, socket } = useSocket();
  const queryClient = useQueryClient();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedPrint, setSelectedPrint] = useState<string>("");
  const ALL_SPRINTS_ID = "__all_sprints__";
  const isAllSprints = selectedPrint === ALL_SPRINTS_ID;
  // Bộ lọc theo thành viên (dropdown)
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string>("all");
  const lastJiraRefetchAtRef = useRef<number | null>(null);
  const [rtJiraUpdateSeq, setRtJiraUpdateSeq] = useState(0);
  const selectedPrintRef = useRef(selectedPrint);
  const isAllSprintsRef = useRef(isAllSprints);
  const isLeaderRef = useRef(isLeaderState);
  const selectedAssigneeFilterRef = useRef(selectedAssigneeFilter);
  const lastAutoSwitchAllSprintsAtRef = useRef<number>(0);

  // Resolve teamId giống trang /commits và /config (đưa lên trước để dùng trong effects realtime)
  const classId = Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  // Ưu tiên teamId đã được lưu ở cookie (tránh join nhầm room do student_team_name chưa kịp sync)
  const cookieTeamId =
    Cookies.get("student_team_id") || Cookies.get("lecturer_team_id") || "";
  const { data: teamsData } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find((t: any) => t.project_name === myTeamName);
  const isCookieTeamIdValidInThisClass = useMemo(() => {
    if (!cookieTeamId) return false;
    const teams = teamsData?.teams || [];
    return teams.some((t: any) => t?._id === cookieTeamId);
  }, [cookieTeamId, teamsData]);
  const resolvedTeamId =
    (isCookieTeamIdValidInThisClass ? cookieTeamId : "") ||
    myTeamInfo?._id ||
    teamsData?.teams?.[0]?._id;

  useEffect(() => {
    selectedPrintRef.current = selectedPrint;
    isAllSprintsRef.current = isAllSprints;
    isLeaderRef.current = isLeaderState;
    selectedAssigneeFilterRef.current = selectedAssigneeFilter;
  }, [selectedPrint, isAllSprints, isLeaderState, selectedAssigneeFilter]);

  // Fallback/refetch chắc ăn cho Kanban:
  // SocketProvider luôn dispatch `rt:jira-issue-updated` khi nhận `JIRA_ISSUE_UPDATED`,
  // nên UI không phụ thuộc vào logic "đang ở /tasks" trong SocketProvider.
  useEffect(() => {
    let t1: number | null = null;
    let t2: number | null = null;

    const refetchTaskQueries = () => {
      const keyRoots = ["team-tasks", "team-all-tasks", "member-tasks", "my-tasks"];
      const queries = queryClient
        .getQueryCache()
        .findAll({
          predicate: (q) => {
            const k = q.queryKey;
            return (
              Array.isArray(k) &&
              typeof k[0] === "string" &&
              keyRoots.includes(k[0])
            );
          },
        });

      queries.forEach((q) => {
        queryClient.refetchQueries({ queryKey: q.queryKey, exact: true, type: "all" });
      });

      // Force re-mapping UI ngay sau khi refetch
      setRtJiraUpdateSeq((v) => v + 1);
    };

    const handler = (event?: Event) => {
      const now = Date.now();
      const last = lastJiraRefetchAtRef.current;
      if (last != null && now - last < 1200) return;
      lastJiraRefetchAtRef.current = now;

      // Nếu đang filter theo sprint, việc refetch theo sprint có thể làm "mất" task
      // khi task bị update sang trạng thái "không thuộc sprint" / sprint khác.
      // UX: auto chuyển sang "All Sprints" để user không tưởng là task bị xóa.
      if (
        !isAllSprintsRef.current &&
        isLeaderRef.current &&
        selectedAssigneeFilterRef.current === "all"
      ) {
        const lastSwitch = lastAutoSwitchAllSprintsAtRef.current;
        if (now - lastSwitch > 4000) {
          lastAutoSwitchAllSprintsAtRef.current = now;
          setSelectedPrint(ALL_SPRINTS_ID);
          // Prefetch ngay data "All Sprints" để tránh trạng thái rỗng/ẩn task sau khi switch filter.
          // (Hook `useTeamAllTasks` sẽ reuse cache key này.)
          if (resolvedTeamId) {
            queryClient
              .fetchQuery({
                queryKey: ["team-all-tasks", resolvedTeamId],
                queryFn: () => getTeamAllTasksApi(resolvedTeamId),
              })
              .catch(() => {
                // ignore (toast sẽ được handle ở UI error state nếu cần)
              });
          }
          toast.message("Kanban vừa có cập nhật từ Jira", {
            description: "Đã tự chuyển filter sang 'All Sprints' để tránh task bị ẩn theo sprint.",
          });
        }
      }

      // Optimistic update ngay lập tức để Kanban "nhảy liền"
      // dù API có thể trễ vài giây sau khi webhook emit.
      const detail = (event as CustomEvent<any> | undefined)?.detail;
      const issueKeyRaw =
        detail?.issueKey ??
        detail?.issue_key ??
        detail?.issue?.key;
      const nextStatusRaw =
        detail?.status ??
        detail?.status_name ??
        detail?.issue?.fields?.status?.name;
      const issueKey = typeof issueKeyRaw === "string" ? issueKeyRaw.trim() : "";
      const nextStatus =
        typeof nextStatusRaw === "string"
          ? mapApiTaskToStatus(undefined, nextStatusRaw)
          : null;
      if (issueKey && nextStatus) {
        setTasks((prev) =>
          prev.map((t) => {
            const k = String(t.key || t.id || "").trim();
            return k.toLowerCase() === issueKey.toLowerCase()
              ? { ...t, status: nextStatus }
              : t;
          }),
        );
      }

      // Refetch ngay + retry nhẹ để tránh case BE emit event trước khi DB/API kịp cập nhật.
      refetchTaskQueries();

      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
      t1 = window.setTimeout(refetchTaskQueries, 1200);
      t2 = window.setTimeout(refetchTaskQueries, 3000);
    };

    window.addEventListener("rt:jira-issue-updated", handler as EventListener);
    return () => {
      window.removeEventListener("rt:jira-issue-updated", handler as EventListener);
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, [queryClient, resolvedTeamId]);

  // Bắt trực tiếp socket event tại /tasks để tránh phụ thuộc bridge window event.
  useEffect(() => {
    const directHandler = (data: any) => {
      if (typeof window === "undefined") return;
      window.dispatchEvent(
        new CustomEvent("rt:jira-issue-updated", {
          detail: data,
        }),
      );
    };

    socket.on("JIRA_ISSUE_UPDATED", directHandler);
    socket.on("jira_issue_updated", directHandler);
    socket.on("JIRA_ISSUE_UPDATE", directHandler);
    socket.on("jira_issue_update", directHandler);
    socket.on("jiraIssueUpdated", directHandler);
    socket.on("MEMBER_UPDATED", directHandler);
    socket.on("member_updated", directHandler);

    return () => {
      socket.off("JIRA_ISSUE_UPDATED", directHandler);
      socket.off("jira_issue_updated", directHandler);
      socket.off("JIRA_ISSUE_UPDATE", directHandler);
      socket.off("jira_issue_update", directHandler);
      socket.off("jiraIssueUpdated", directHandler);
      socket.off("MEMBER_UPDATED", directHandler);
      socket.off("member_updated", directHandler);
    };
  }, [socket]);
  // Member detail (tab bảng tất cả thành viên)
  const [selectedTableMemberId, setSelectedTableMemberId] = useState<string | null>(null);
  // Tab hiện tại (board hoặc table)
  const [currentTab, setCurrentTab] = useState<string>("board");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTask, setFormTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    assigneeId: "",
    status: "todo",
    storyPoints: 1,
    priority: "Medium",
    type: "General",
    courseId: "",
    printId: "",
    deadline: "",
    startDate: "",
  });


  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "task" | "sprint";
    id: string;
    name: string;
    subtitle?: string; // task key (e.g. PROJ-123) cho task
  } | null>(null);
  // (moved above)

  // Đảm bảo room team luôn được join tại chính trang /tasks
  // để nhận event realtime emit theo team room.
  useEffect(() => {
    if (!isConnected || !resolvedTeamId) return;
    socket.emit("join_team", resolvedTeamId);
    socket.emit("joinTeam", resolvedTeamId);
    Cookies.set("student_team_id", resolvedTeamId);
  }, [isConnected, resolvedTeamId, socket]);

  const { data: teamDetailData } = useTeamDetail(resolvedTeamId);
  const projectId = teamDetailData?.project?._id;

  // BE contract mới: task realtime phát theo room project:<projectId>
  useEffect(() => {
    if (!isConnected || !projectId) return;
    const normalizedProjectId = String(projectId).replace(/^project:/, "");
    socket.emit("join_project", normalizedProjectId);
    socket.emit("joinProject", normalizedProjectId);
    Cookies.set("student_project_id", normalizedProjectId);
  }, [isConnected, projectId, socket]);

  // Fetch sprints từ Jira
  const { data: teamSprintsData, isLoading: isSprintsLoading } = useTeamSprints(resolvedTeamId);

  // Fetch members của team (để map assignee -> tên/initials, và xác định user hiện tại)
  const { data: teamMembersData } = useTeamMembers(resolvedTeamId);

  // Fetch Jira users của team (dùng cho assignee dropdown khi thêm task)
  const { data: jiraUsersData } = useJiraUsers(resolvedTeamId);

  // Map jira_account_id -> member._id để gọi API member tasks
  const memberIdMap = useMemo(() => {
    const map = new Map<string, string>();
    (teamMembersData?.members || []).forEach((m: any) => {
      const jiraId = m?.jira_account_id;
      const memberId = m?._id;
      if (jiraId && memberId) {
        map.set(jiraId, memberId);
      }
    });
    return map;
  }, [teamMembersData]);

  // Xác định memberId từ selectedAssigneeFilter
  const selectedMemberId = useMemo(() => {
    if (selectedAssigneeFilter === "all") {
      return undefined;
    }
    return memberIdMap.get(selectedAssigneeFilter);
  }, [selectedAssigneeFilter, memberIdMap]);

  // Fetch tasks theo sprint (chỉ Leader) - dùng khi chọn "Tất cả thành viên"
  const shouldFetchTeamTasks =
    isLeaderState && selectedAssigneeFilter === "all" && !isAllSprints;
  const {
    data: teamTasksData,
    isLoading: isTeamTasksLoading,
    isError: isTeamTasksError,
  } = useTeamTasks(
    shouldFetchTeamTasks ? resolvedTeamId : undefined,
    shouldFetchTeamTasks ? selectedPrint : undefined,
  );

  // Fetch tasks theo member (chỉ Leader khi chọn một thành viên cụ thể)
  const {
    data: memberTasksData,
    isLoading: isMemberTasksLoading,
    isError: isMemberTasksError,
  } = useMemberTasks(
    isLeaderState ? resolvedTeamId : undefined,
    isLeaderState ? selectedMemberId : undefined
  );

  // Fetch my-tasks (chỉ Member, không phải Leader) - GET /integrations/my-tasks
  const {
    data: myTasksData,
    isLoading: isMyTasksLoading,
    isError: isMyTasksError,
  } = useMyTasks(!isLeaderState);

  const shouldFetchTeamAllTasksForBoard =
    isLeaderState && currentTab === "board" && selectedAssigneeFilter === "all" && isAllSprints;
  const {
    data: teamAllTasksDataForBoard,
    isLoading: isTeamAllTasksForBoardLoading,
    isError: isTeamAllTasksForBoardError,
  } = useTeamAllTasks(shouldFetchTeamAllTasksForBoard ? resolvedTeamId : undefined);

  const teamAllTasksFlatForBoard = useMemo(() => {
    const data = teamAllTasksDataForBoard;
    if (!data?.members_tasks || !Array.isArray(data.members_tasks)) return [] as any[];
    const allTasks: any[] = [];
    data.members_tasks.forEach((mt: any) => {
      const member = mt.member;
      const jiraId = member?.jira_account_id || `__member_${member?._id}`;
      (Array.isArray(mt.tasks) ? mt.tasks : []).forEach((t: any) => {
        // Trả về shape giống API tasks để effect map phía dưới hoạt động.
        allTasks.push({
          ...t,
          assignee_account_id: jiraId,
        });
      });
    });

    return allTasks;
  }, [teamAllTasksDataForBoard]);

  // Kết hợp dữ liệu tasks cho board: Leader dùng team/member tasks, Member dùng my-tasks
  const teamTasksDataFinal = useMemo(() => {
    if (isLeaderState) {
      if (selectedAssigneeFilter !== "all") {
        return memberTasksData;
      }
      if (isAllSprints) {
        return teamAllTasksFlatForBoard;
      }
      return teamTasksData;
    }
    return myTasksData ?? [];
  }, [
    isLeaderState,
    selectedAssigneeFilter,
    memberTasksData,
    teamTasksData,
    myTasksData,
    isAllSprints,
    teamAllTasksFlatForBoard,
  ]);

  const isTasksLoading = isLeaderState
    ? selectedAssigneeFilter !== "all"
      ? isMemberTasksLoading
      : isAllSprints
        ? isTeamAllTasksForBoardLoading
        : isTeamTasksLoading
    : isMyTasksLoading;
  const isTasksError = isLeaderState
    ? selectedAssigneeFilter !== "all"
      ? isMemberTasksError
      : isAllSprints
        ? isTeamAllTasksForBoardError
        : isTeamTasksError
    : isMyTasksError;

  // Fetch tasks cho tab Board Team
  const isMemberBoardTab = currentTab === "board-team";
  const {
    data: teamAllTasksData,
    isLoading: isTeamAllTasksLoading,
    isError: isTeamAllTasksError,
  } = useTeamAllTasks(isMemberBoardTab ? resolvedTeamId : undefined);

  // Hook để tạo sprint mới
  // Hook để cập nhật sprint
  // Hook để tạo task mới
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask(resolvedTeamId);

  // Hook để cập nhật task
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask(resolvedTeamId);

  // Hook để xóa task
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();

  const formatDateVN_yyyyMMdd = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    // en-CA gives YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };

  const formatDateVN_ddMMyyyy = (dateStr?: string) => {
    if (!dateStr) return "";
    // Nếu là ISO string, parse thành Date
    const d = dateStr.includes("T") || dateStr.includes("Z")
      ? new Date(dateStr)
      : new Date(dateStr + "T00:00:00"); // Nếu là yyyy-MM-dd, thêm time để parse đúng
    if (Number.isNaN(d.getTime())) return dateStr; // Fallback về string gốc nếu parse lỗi
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const apiSprints: Sprint[] = useMemo(() => {
    if (!teamSprintsData || teamSprintsData.length === 0) return [];

    // Chỉ lấy các sprint đang active để hiển thị trên trang Tasks
    const activeSprints = teamSprintsData.filter(
      (s: any) => s.state === "active",
    );

    if (activeSprints.length === 0) return [];

    return activeSprints.map((s: any) => {
      const id = s._id || s.id || `${s.name}-${s.start_date || ""}-${s.end_date || ""}`;
      const deadline = typeof s.end_date === "string" ? formatDateVN_yyyyMMdd(s.end_date) : "";
      return { id, name: s.name, deadline };
    });
  }, [teamSprintsData]);

  // Map sprintId -> meta từ API (start_date, end_date, state)
  const sprintMetaMap = useMemo(() => {
    if (!teamSprintsData) return {} as Record<
      string,
      { start_date?: string; end_date?: string; state?: string }
    >;
    const map: Record<string, { start_date?: string; end_date?: string; state?: string }> = {};
    teamSprintsData.forEach((s: any) => {
      const id =
        s._id ||
        s.id ||
        `${s.name}-${s.start_date || ""}-${s.end_date || ""}`;
      map[id] = {
        start_date: s.start_date,
        end_date: s.end_date,
        state: s.state,
      };
    });
    return map;
  }, [teamSprintsData]);

  // Cập nhật sprints state từ API
  useEffect(() => {
    setSprints(apiSprints);
  }, [apiSprints]);

  // Default chọn sprint: ưu tiên sprint active (nếu có), fallback sprint đầu tiên
  useEffect(() => {
    if (!sprints || sprints.length === 0) return;

    const exists =
      selectedPrint === ALL_SPRINTS_ID ||
      (!!selectedPrint && sprints.some((sp) => sp.id === selectedPrint));
    if (exists) return;

    const activeFromApi = teamSprintsData?.find((s: any) => s.state === "active");
    const activeId = activeFromApi
      ? activeFromApi._id ||
        `${activeFromApi.name}-${activeFromApi.start_date || ""}-${activeFromApi.end_date || ""}`
      : undefined;

    const nextSelected = activeId && sprints.some((sp) => sp.id === activeId) ? activeId : sprints[0].id;
    setSelectedPrint(nextSelected);
    setFormTask((prev) => ({ ...prev, printId: nextSelected }));
  }, [sprints, selectedPrint, teamSprintsData]);

  // Resolve current user (ưu tiên mapping Jira account id để so sánh với assignee_account_id từ task API)
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeaderState(leaderStatus);
  }, []);

  const isLeader = isLeaderState;

  // Đảm bảo nếu không phải Leader thì không thể ở tab Leader-only
  useEffect(() => {
    if (!isLeader && currentTab === "board-member") {
      setCurrentTab("board");
    }
  }, [isLeader, currentTab]);

  // Nếu có mapping team members, dùng Jira account id của user hiện tại để check quyền edit cho MEMBER
  useEffect(() => {
    const studentId = Cookies.get("student_id") || "";
    if (!studentId || !teamMembersData?.members) return;

    const currentMember = teamMembersData.members.find((m: any) => m?.student?._id === studentId);
    const jiraAccountId = currentMember?.jira_account_id || "";
    setCurrentUserId(jiraAccountId);
  }, [teamMembersData]);

  const getInitials = (name?: string) => {
    const s = (name || "").trim();
    if (!s) return "NA";
    const parts = s.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const members = useMemo(() => {
    const map = new Map<string, { id: string; name: string; initials: string }>();

    // Prefer team members (mapped Jira account id) - chỉ lấy student.full_name
    (teamMembersData?.members || []).forEach((m: any) => {
      const jiraId = m?.jira_account_id;
      const fullName = m?.student?.full_name;
      // Chỉ hiển thị member khi có cả jira_account_id và full_name
      if (!jiraId || !fullName) return;
      map.set(jiraId, { id: jiraId, name: fullName, initials: getInitials(fullName) });
    });

    // Fallback: create members from tasks response (Leader: team/member tasks; Member: my-tasks)
    const tasksForMembers = isLeaderState
      ? (selectedAssigneeFilter !== "all" && selectedAssigneeFilter !== "__unassigned" ? memberTasksData : teamTasksData)
      : myTasksData;
    (Array.isArray(tasksForMembers) ? tasksForMembers : []).forEach((t: any) => {
      const jiraId = t?.assignee_account_id;
      if (!jiraId) return;
      if (map.has(jiraId)) return;
      const name = t?.assignee_name || "Member";
      map.set(jiraId, { id: jiraId, name, initials: getInitials(name) });
    });

    return Array.from(map.values());
  }, [teamMembersData, teamTasksData, memberTasksData, myTasksData, selectedAssigneeFilter, isLeaderState]);

  // Assignee options từ Jira users (dùng cho dropdown khi thêm task) - dùng display_name từ API
  const assigneeOptions = useMemo(() => {
    const jiraUsers = jiraUsersData?.users || [];
    const teamMembers = teamMembersData?.members || [];
    const options = jiraUsers.map((u: { jira_account_id: string; display_name?: string }) => {
      const jiraId = u.jira_account_id;
      const name = u.display_name || jiraId;
      return { id: jiraId, name };
    });
    // Đảm bảo currentUserId có trong options khi MEMBER (để form luôn có giá trị hợp lệ)
    if (currentUserId && !options.some((o) => o.id === currentUserId)) {
      const member = teamMembers.find((m: any) => m?.jira_account_id === currentUserId);
      const name = member?.student?.full_name || member?.student?.student_code || currentUserId;
      options.push({ id: currentUserId, name });
    }
    return options;
  }, [jiraUsersData, teamMembersData, currentUserId]);

  const tableTasks = useMemo(() => {
    if (!teamAllTasksData?.members_tasks) return [];
    
    const allTasks: Task[] = [];
    teamAllTasksData.members_tasks.forEach((mt: any) => {
      const member = mt.member;
      const jiraId = member?.jira_account_id || `__member_${member?._id}`;
      
      mt.tasks.forEach((t: any) => {
        const id = t._id || t.issue_id || t.issue_key;
        // Xử lý sprint_id: có thể là string hoặc object { _id, name, state }
        const sprintId = typeof t.sprint_id === "object" && t.sprint_id?._id
          ? t.sprint_id._id
          : t.sprint_id || selectedPrint;
        const sprintName = typeof t.sprint_id === "object" ? t.sprint_id?.name : undefined;
        const sprintState = typeof t.sprint_id === "object" ? t.sprint_id?.state : undefined;
        allTasks.push({
          id,
          key: t.issue_key || id,
          title: t.summary || t.title || t.issue_key || id,
          description: t.description,
          assigneeId: jiraId,
          status: mapApiTaskToStatus(t.status_category, t.status_name),
          storyPoints: Number(t.story_point ?? 0) || 0,
          priority: "Medium",
          type: "Jira",
          courseId: "",
          printId: sprintId,
          sprintName,
          sprintState,
          deadline: t.due_date ? formatDateVN_yyyyMMdd(t.due_date) : "",
          startDate: t.start_date ? formatDateVN_yyyyMMdd(t.start_date) : undefined,
        });
      });
    });
    
    return allTasks;
  }, [teamAllTasksData, selectedPrint]);

  const tableMemberOptions = useMemo(() => {
    if (!teamAllTasksData?.members_tasks) return [];
    return teamAllTasksData.members_tasks.map((mt: any) => {
      const m = mt.member || {};
      const student = m.student || {};
      const name =
        student.full_name ||
        student.student_code ||
        m.github_username ||
        `Member ${m._id?.slice(-4) || ""}`;
      return {
        id: m._id as string,
        displayName: name,
        initials: getInitials(name),
        role: m.role_in_team as string | undefined,
        studentCode: student.student_code as string | undefined,
        email: student.email as string | undefined,
        total: Number(mt.total ?? 0) || 0,
        tasks: Array.isArray(mt.tasks) ? mt.tasks : [],
      };
    });
  }, [teamAllTasksData]);

  const selectedTableMember = useMemo(() => {
    if (!tableMemberOptions.length) return null;
    const id = selectedTableMemberId ?? tableMemberOptions[0].id;
    return tableMemberOptions.find((m) => m.id === id) ?? tableMemberOptions[0];
  }, [tableMemberOptions, selectedTableMemberId]);

  // Đồng bộ tasks state từ API mỗi khi sprint thay đổi / refetch xong (cho tab board)
  useEffect(() => {
    // Chỉ update tasks state khi đang ở tab board
    if (currentTab !== "board") return;

    const taskList = Array.isArray(teamTasksDataFinal) ? teamTasksDataFinal : [];
    const mapped: Task[] = taskList.map((t: any) => {
      // id dùng cho API (PUT/DELETE) → ưu tiên _id từ BE
      const id = t._id || t.issue_id || t.issue_key;
      const assigneeId = t.assignee_account_id || "__unassigned";
      // Xử lý sprint_id: có thể là string hoặc object { _id, name, state }
      const sprintId = typeof t.sprint_id === "object" && t.sprint_id?._id
        ? t.sprint_id._id
        : t.sprint_id || selectedPrint;
      const sprintName = typeof t.sprint_id === "object" ? t.sprint_id?.name : undefined;
      const sprintState = typeof t.sprint_id === "object" ? t.sprint_id?.state : undefined;
      return {
        id,
        key: t.issue_key || id,
        title: t.summary || t.title || t.issue_key || id,
        description: t.description,
        assigneeId,
        status: mapApiTaskToStatus(t.status_category, t.status_name),
        storyPoints: Number(t.story_point ?? 0) || 0,
        priority: "Medium",
        type: "Jira",
        courseId: "",
        printId: sprintId,
        sprintName,
        sprintState,
        deadline: t.due_date ? formatDateVN_yyyyMMdd(t.due_date) : "",
        startDate: t.start_date ? formatDateVN_yyyyMMdd(t.start_date) : undefined,
      };
    });

    setTasks(mapped);
  }, [teamTasksDataFinal, selectedPrint, currentTab, rtJiraUpdateSeq]);

  const resetTaskForm = () => {
    const defaultAssigneeId = isLeader
      ? (assigneeOptions[0]?.id ?? members[0]?.id ?? "")
      : currentUserId;
    setFormTask({
      id: "",
      title: "",
      description: "",
      assigneeId: defaultAssigneeId,
      status: "todo",
      storyPoints: 1,
      priority: "Medium",
      type: "General",
      courseId: "",
      printId: selectedPrint || sprints[0]?.id || "",
      deadline: "",
      startDate: "",
    });
    setEditingTask(null);
  };

  const handleSaveTask = () => {
    if (!formTask.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề task");
      return;
    }
    if (!formTask.assigneeId) {
      toast.error("Vui lòng chọn người phụ trách");
      return;
    }
    if (!formTask.printId) {
      toast.error("Vui lòng chọn sprint");
      return;
    }
    if (!formTask.deadline) {
      toast.error("Vui lòng chọn hạn chót (due date)");
      return;
    }
    if (!formTask.startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu (start date)");
      return;
    }
    if (!resolvedTeamId) {
      toast.error("Không tìm thấy team ID");
      return;
    }

    // MEMBER chỉ có thể thêm/sửa task cho chính mình
    if (!isLeader && formTask.assigneeId !== currentUserId) {
      toast.error("Bạn chỉ có thể thêm/sửa task cho chính mình");
      return;
    }

    // MEMBER chỉ có thể sửa task của chính mình
    if (!isLeader && editingTask && editingTask.assigneeId !== currentUserId) {
      toast.error("Bạn chỉ có thể sửa task của chính mình");
      return;
    }

    if (editingTask) {
      updateTask(
        {
          taskId: editingTask.id,
          payload: {
            team_id: resolvedTeamId!,
            summary: formTask.title.trim(),
            description: formTask.description ?? "",
            status: mapStatusToStatusName(formTask.status),
            sprint_id: formTask.printId,
            assignee_account_id: formTask.assigneeId,
            story_point: formTask.storyPoints,
            start_date: formTask.startDate!,
            due_date: formTask.deadline,
            // reporter_account_id: optional - BE có thể suy ra từ context
          },
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetTaskForm();
          },
        }
      );
    } else {
      createTask(
        {
          summary: formTask.title.trim(),
          description: formTask.description ?? "",
          assignee_account_id: formTask.assigneeId,
          story_point: formTask.storyPoints,
          start_date: formTask.startDate!,
          due_date: formTask.deadline,
          sprint_id: formTask.printId,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetTaskForm();
          },
        }
      );
    }
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setDeleteTarget({ type: "task", id, name: task.title, subtitle: task.id });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteTask(deleteTarget.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  const visibleTasks = useMemo(
    () =>
      tasks
        .filter((t) => (isAllSprints ? true : t.printId === selectedPrint))
        .filter((t) =>
          selectedAssigneeFilter === "all" ? true : t.assigneeId === selectedAssigneeFilter,
        ),
    [tasks, selectedPrint, selectedAssigneeFilter, isAllSprints],
  );

  const currentSprint = useMemo(
    () => (isAllSprints ? undefined : sprints.find((p) => p.id === selectedPrint)),
    [sprints, selectedPrint, isAllSprints],
  );
  const sprintOverdue = isDateOverdue(currentSprint?.deadline);
  const currentSprintMeta = !isAllSprints ? sprintMetaMap[selectedPrint] || undefined : undefined;

  // NOTE: Sprints được lấy từ Jira nên không cho thao tác CRUD thủ công tại UI /tasks.

  // Trang này dành cho Sinh viên
  if (role !== "STUDENT") {
    // Logic cũ check LEADER/MEMBER
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-[#F27124]" />
            Team Task Board
          </h2>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                isConnected
                  ? "border-emerald-300 text-emerald-700 bg-emerald-50/60 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/30"
                  : "border-slate-300 text-slate-500 bg-slate-50/60 dark:border-slate-800 dark:text-slate-400 dark:bg-slate-900/20"
              }
            >
              Socket.io: {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Theo dõi danh sách task của từng thành viên
          </p>
        </div>

        {currentTab === "board" && (
          <div className="flex flex-col items-end gap-2">
            <TaskBoardHeader
              sprints={sprints}
              selectedSprint={selectedPrint}
              onSprintChange={(v) => {
                setSelectedPrint(v);
                  const nextSprintId =
                    v === ALL_SPRINTS_ID ? sprints[0]?.id || "" : v;
                  setFormTask((prev) => ({ ...prev, printId: nextSprintId }));
              }}
              isSprintsLoading={isSprintsLoading}
              currentSprint={currentSprint}
              sprintOverdue={sprintOverdue}
              isLeader={isLeader}
              sprintMeta={currentSprintMeta}
              onAddTask={() => {
                setEditingTask(null);
                resetTaskForm();
                setDialogOpen(true);
              }}
            />
          </div>
        )}
      </div>

      <Separator />

      {sprints.length === 0 && !isSprintsLoading && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-100">
          <RefreshCw className="h-4 w-4" />
          <AlertTitle>Chưa có sprint</AlertTitle>
          <AlertDescription>
            Vui lòng đồng bộ Jira tại trang{" "}
            <Link href="/project" className="font-medium underline hover:no-underline">
              Thông tin dự án
            </Link>{" "}
            để lấy danh sách sprint từ Jira.
          </AlertDescription>
        </Alert>
      )}

      {currentSprint && sprintOverdue && (
        <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100">
          <AlertTitle>Đã quá hạn deadline sprint</AlertTitle>
          <AlertDescription>
            <b>{currentSprint.name} ngày {formatDateVN_ddMMyyyy(currentSprint.deadline)}.</b> Vui lòng rà soát lại các task chưa hoàn thành.
          </AlertDescription>
        </Alert>
      )}

      {/* VIEW SWITCHER: BOARD / BOARD TEAM */}
      <Tabs defaultValue="board" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="h-9 bg-slate-100 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-xl">
          <TabsTrigger value="board" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <KanbanSquare className="h-4 w-4" />
            Board
          </TabsTrigger>
          {isLeader && (
            <TabsTrigger value="board-team" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              <LayoutDashboard className="h-4 w-4" />
              Board Team
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent
          value="board"
          className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
        >
          {isTasksLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tải tasks...
            </div>
          ) : isTasksError ? (
            <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100">
              <AlertTitle>Lỗi tải tasks</AlertTitle>
              <AlertDescription>
                Không thể lấy danh sách tasks từ server. Vui lòng thử lại.
              </AlertDescription>
            </Alert>
          ) : visibleTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20">
              <p className="text-muted-foreground text-center mb-4">
                Chưa có tasks. Vui lòng đồng bộ Jira tại trang Thông tin dự án hoặc thêm task mới.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/project">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Đồng bộ Jira
                  </Link>
                </Button>
                <Button onClick={() => { setEditingTask(null); resetTaskForm(); setDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm task
                </Button>
              </div>
            </div>
          ) : (
            <KanbanView
              statusColumns={statusColumns}
              tasks={visibleTasks}
              members={members}
              isTaskOverdue={isTaskOverdue}
              isLeader={isLeader}
              currentUserId={currentUserId}
              onEditTask={(task) => {
                setEditingTask(task);
                setFormTask(task);
                setDialogOpen(true);
              }}
              onViewTask={setViewTask}
              onDeleteTask={handleDeleteTask}
              onTaskStatusChange={(taskId, newStatus) => {
                const task = tasks.find((t) => t.id === taskId);
                if (!task || !resolvedTeamId) {
                  toast.error("Không tìm thấy task hoặc team ID");
                  return;
                }

                // Map TaskStatus -> status_name Jira: "To Do" | "In Progress" | "Done"
                const statusName = mapStatusToStatusName(newStatus);

                // Optimistic update UI ngay
                setTasks((prev) =>
                  prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
                );

                // Gọi API PUT /tasks/{id} để cập nhật status (kéo thả Kanban)
                updateTask(
                  {
                    taskId: task.id,
                    payload: {
                      team_id: resolvedTeamId,
                      status: statusName,
                    },
                  },
                  {
                    onError: () => {
                      // Rollback nếu API lỗi
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === taskId ? { ...t, status: task.status } : t,
                        ),
                      );
                    },
                  }
                );
              }}
            />
          )}
        </TabsContent>

        {isLeader && (
          <TabsContent
            value="board-team"
            className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
          >
          {isTeamAllTasksLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tải tasks...
            </div>
          ) : isTeamAllTasksError ? (
            <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100">
              <AlertTitle>Lỗi tải tasks</AlertTitle>
              <AlertDescription>
                Không thể lấy danh sách tasks từ server. Vui lòng thử lại.
              </AlertDescription>
            </Alert>
          ) : !teamAllTasksData || tableTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20">
              <p className="text-muted-foreground text-center mb-4">
                Chưa có tasks. Vui lòng đồng bộ Jira tại trang Thông tin dự án hoặc thêm task mới.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/project">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Đồng bộ Jira
                  </Link>
                </Button>
                <Button onClick={() => { setEditingTask(null); resetTaskForm(); setDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm task
                </Button>
              </div>
            </div>
          ) : (
            tableMemberOptions.length > 0 &&
            selectedTableMember && (
              <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border bg-background">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {selectedTableMember.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {selectedTableMember.displayName}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {selectedTableMember.email ||
                          selectedTableMember.studentCode ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Select
                        value={
                          selectedTableMemberId ?? selectedTableMember.id
                        }
                        onValueChange={(v) => setSelectedTableMemberId(v)}
                      >
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue placeholder="Chọn thành viên" />
                        </SelectTrigger>
                        <SelectContent>
                          {tableMemberOptions.map((opt) => (
                            <SelectItem
                              key={opt.id}
                              value={opt.id}
                              className="text-xs"
                            >
                              {opt.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedTableMember.role && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5"
                        >
                          {selectedTableMember.role === "Leader"
                            ? "Leader"
                            : "Member"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <Badge variant="outline">
                        Tổng task:
                        <span className="ml-1 font-semibold">
                          {selectedTableMember.total}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        Hoàn thành:
                        <span className="ml-1 font-semibold">
                          {selectedTableMember.tasks.filter(
                            (t: any) =>
                              (t.status_category || "")
                                .toLowerCase()
                                .trim() === "done"
                          ).length}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[380px] overflow-y-auto">
                  {selectedTableMember.tasks.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic">
                      Thành viên này chưa có task nào.
                    </p>
                  ) : (
                    selectedTableMember.tasks.map((t: any) => {
                      const status = mapApiTaskToStatus(
                        t.status_category,
                        t.status_name
                      );
                      const deadline = t.due_date
                        ? formatDateVN_ddMMyyyy(t.due_date)
                        : "";
                      const start = t.start_date
                        ? formatDateVN_ddMMyyyy(t.start_date)
                        : "";
                      const overdue =
                        t.due_date &&
                        status !== "done" &&
                        isDateOverdue(t.due_date);

                      const mappedTask: Task = {
                        id: t._id || t.issue_id || t.issue_key,
                        key: t.issue_key || t.issue_id,
                        title: t.summary || t.issue_key || "",
                        description: t.description,
                        assigneeId: t.assignee_account_id || selectedTableMember.id,
                        status,
                        storyPoints: Number(t.story_point ?? 0) || 0,
                        priority: "Medium",
                        type: "Jira",
                        courseId: "",
                        printId:
                          typeof t.sprint_id === "object" && t.sprint_id?._id
                            ? t.sprint_id._id
                            : t.sprint_id || "",
                        sprintName: typeof t.sprint_id === "object" ? t.sprint_id?.name : undefined,
                        sprintState: typeof t.sprint_id === "object" ? t.sprint_id?.state : undefined,
                        deadline: t.due_date ? formatDateVN_yyyyMMdd(t.due_date) : "",
                        startDate: t.start_date ? formatDateVN_yyyyMMdd(t.start_date) : undefined,
                      };

                      return (
                        <div
                          key={t._id || t.issue_id || t.issue_key}
                          role="button"
                          tabIndex={0}
                          onClick={() => setViewTask(mappedTask)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setViewTask(mappedTask);
                            }
                          }}
                          className={
                            "rounded-lg border px-4 py-3 text-xs space-y-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 " +
                            (overdue
                              ? "border-red-300 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30 dark:hover:bg-red-950/40"
                              : "border-slate-200 bg-background")
                          }
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge
                                variant="outline"
                                className="font-mono text-[10px] px-1.5 py-0.5"
                              >
                                {t.issue_key || t.issue_id}
                              </Badge>
                              <span className="font-medium truncate">
                                {t.summary || t.issue_key}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                "text-[10px] px-1.5 py-0.5 " +
                                (status === "done"
                                  ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                                  : status === "in-progress"
                                  ? "border-blue-300 text-blue-700 bg-blue-50"
                                  : status === "review"
                                  ? "border-amber-300 text-amber-700 bg-amber-50"
                                  : "border-slate-300 text-slate-700 bg-slate-50")
                              }
                            >
                              {t.status_name || "Unknown"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                            {t.sprint_id?.name && (
                              <span className="flex items-center gap-1.5">
                                Sprint:{" "}
                                <span className="font-medium">
                                  {t.sprint_id.name}
                                </span>
                                {t.sprint_id?.state && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      "text-[9px] px-1 py-0 " +
                                      (t.sprint_id.state === "active"
                                        ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                                        : t.sprint_id.state === "closed"
                                        ? "border-slate-300 text-slate-500 bg-slate-50 dark:bg-slate-800 opacity-70"
                                        : "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40")
                                    }
                                  >
                                    {t.sprint_id.state === "active"
                                      ? "Đang chạy"
                                      : t.sprint_id.state === "closed"
                                      ? "Đã đóng"
                                      : "Sắp tới"}
                                  </Badge>
                                )}
                              </span>
                            )}
                            {start && (
                              <span>
                                Bắt đầu:{" "}
                                <span className="font-medium">{start}</span>
                              </span>
                            )}
                            {deadline && (
                              <span>
                                Hạn:{" "}
                                <span className="font-medium">
                                  {deadline}
                                </span>
                              </span>
                            )}
                            <span>{t.story_point ?? 0} SP</span>
                          </div>
                          {overdue && (
                            <span className="inline-flex items-center text-[10px] text-red-600 dark:text-red-400">
                              Quá hạn
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            )
          )}
          </TabsContent>
        )}
      </Tabs>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={!!editingTask}
        formTask={formTask}
        setFormTask={setFormTask}
        onSave={handleSaveTask}
        isSaving={isCreatingTask || isUpdatingTask}
        members={members}
        assigneeOptions={assigneeOptions}
        sprints={sprints}
        isLeader={isLeader}
        currentUserId={currentUserId}
      />

      <TaskDetailSheet
        open={!!viewTask}
        onOpenChange={(open) => !open && setViewTask(null)}
        task={viewTask}
        members={members}
        projectId={projectId}
        onEditTask={(task) => {
          setViewTask(null);
          setEditingTask(task);
          setFormTask(task);
          setDialogOpen(true);
        }}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Xóa task"
        description="Bạn chắc chắn muốn xóa task này? Hành động này không thể hoàn tác."
        itemName={deleteTarget?.name}
        subtitle={deleteTarget?.subtitle}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingTask}
      />
    </div>
  );
}


