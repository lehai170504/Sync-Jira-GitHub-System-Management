"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanSquare, LayoutDashboard, ListChecks, Loader2, RefreshCw, Plus } from "lucide-react";
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
import { MemberTableView } from "./member-table-view";
import { TaskDialog } from "./task-dialog";
import { SprintDialog } from "./sprint-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useTeamSprints } from "@/features/management/teams/hooks/use-team-sprints";
import { useCreateSprint } from "@/features/management/teams/hooks/use-create-sprint";
import { useUpdateSprint } from "@/features/management/teams/hooks/use-update-sprint";
import { useDeleteSprint } from "@/features/management/teams/hooks/use-delete-sprint";
import { useTeamTasks } from "@/features/management/teams/hooks/use-team-tasks";
import { useCreateTask } from "@/features/management/teams/hooks/use-create-task";
import { useUpdateTask } from "@/features/management/teams/hooks/use-update-task";
import { useDeleteTask } from "@/features/management/teams/hooks/use-delete-task";
import { useJiraUsers } from "@/features/management/teams/hooks/use-jira-users";
import { useTeamMembers } from "@/features/student/hooks/use-team-members";
import { useMemberTasks } from "@/features/integration/hooks/use-member-tasks";
import { useTeamAllTasks } from "@/features/integration/hooks/use-team-all-tasks";
import { useMyTasks } from "@/features/integration/hooks/use-my-tasks";

export function TaskBoard() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedPrint, setSelectedPrint] = useState<string>("");
  // Bộ lọc theo thành viên (dropdown)
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string>("all");
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

  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "task" | "sprint";
    id: string;
    name: string;
    subtitle?: string; // task key (e.g. PROJ-123) cho task
  } | null>(null);
  const [formSprint, setFormSprint] = useState<Sprint>({
    id: "",
    name: "",
    deadline: "",
    start_date: "",
    end_date: "",
  });

  // Resolve teamId giống trang /commits và /config
  const classId = Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  const { data: teamsData } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find((t: any) => t.project_name === myTeamName);
  const resolvedTeamId = myTeamInfo?._id || teamsData?.teams?.[0]?._id;

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
    if (selectedAssigneeFilter === "all" || selectedAssigneeFilter === "__unassigned") {
      return undefined;
    }
    return memberIdMap.get(selectedAssigneeFilter);
  }, [selectedAssigneeFilter, memberIdMap]);

  // Fetch tasks theo sprint (chỉ Leader) - dùng khi chọn "Tất cả thành viên"
  const shouldFetchTeamTasks = selectedAssigneeFilter === "all" || selectedAssigneeFilter === "__unassigned";
  const {
    data: teamTasksData,
    isLoading: isTeamTasksLoading,
    isError: isTeamTasksError,
  } = useTeamTasks(
    isLeaderState && shouldFetchTeamTasks ? resolvedTeamId : undefined,
    isLeaderState && shouldFetchTeamTasks ? selectedPrint : undefined
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

  // Kết hợp dữ liệu tasks cho board: Leader dùng team/member tasks, Member dùng my-tasks
  const teamTasksDataFinal = useMemo(() => {
    if (isLeaderState) {
      if (selectedAssigneeFilter !== "all" && selectedAssigneeFilter !== "__unassigned") {
        return memberTasksData;
      }
      return teamTasksData;
    }
    return myTasksData ?? [];
  }, [isLeaderState, selectedAssigneeFilter, memberTasksData, teamTasksData, myTasksData]);

  const isTasksLoading = isLeaderState
    ? (selectedAssigneeFilter !== "all" && selectedAssigneeFilter !== "__unassigned"
        ? isMemberTasksLoading
        : isTeamTasksLoading)
    : isMyTasksLoading;
  const isTasksError = isLeaderState
    ? (selectedAssigneeFilter !== "all" && selectedAssigneeFilter !== "__unassigned"
        ? isMemberTasksError
        : isTeamTasksError)
    : isMyTasksError;

  // Fetch tasks cho tab "Bảng tất cả thành viên" - chỉ fetch khi tab "table" được chọn
  const {
    data: teamAllTasksData,
    isLoading: isTeamAllTasksLoading,
    isError: isTeamAllTasksError,
  } = useTeamAllTasks(currentTab === "table" ? resolvedTeamId : undefined);
  
  // Hook để tạo sprint mới
  const { mutate: createSprint, isPending: isCreatingSprint } = useCreateSprint();
  // Hook để cập nhật sprint
  const { mutate: updateSprint, isPending: isUpdatingSprint } = useUpdateSprint();
  // Hook để xóa sprint
  const { mutate: deleteSprint, isPending: isDeletingSprint } = useDeleteSprint();

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
    return teamSprintsData.map((s: any) => {
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

    const exists = !!selectedPrint && sprints.some((sp) => sp.id === selectedPrint);
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

  // Đảm bảo nếu không phải Leader thì không thể ở tab "table"
  useEffect(() => {
    if (!isLeader && currentTab === "table") {
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

    // Special "Unassigned" bucket so table view can still show tasks without assignee
    map.set("__unassigned", { id: "__unassigned", name: "Unassigned", initials: "NA" });

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

  // Map dữ liệu từ API team-all-tasks cho tab "Bảng tất cả thành viên"
  const tableMembers = useMemo(() => {
    if (!teamAllTasksData?.members_tasks) return [];
    
    return teamAllTasksData.members_tasks.map((mt: any) => {
      const member = mt.member;
      const jiraId = member?.jira_account_id || `__member_${member?._id}`;
      const fullName = member?.student?.full_name || `Member ${member?._id?.slice(-4)}`;
      return {
        id: jiraId,
        name: fullName,
        initials: getInitials(fullName),
      };
    });
  }, [teamAllTasksData]);

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
          deadline: t.due_date ? formatDateVN_yyyyMMdd(t.due_date) : "",
          startDate: t.start_date ? formatDateVN_yyyyMMdd(t.start_date) : undefined,
        });
      });
    });
    
    return allTasks;
  }, [teamAllTasksData, selectedPrint]);

  // Đồng bộ tasks state từ API mỗi khi sprint thay đổi / refetch xong (cho tab board)
  useEffect(() => {
    // Chỉ update tasks state khi đang ở tab board
    if (currentTab !== "board" || !teamTasksDataFinal) return;

    const taskList = Array.isArray(teamTasksDataFinal) ? teamTasksDataFinal : [];
    const mapped: Task[] = taskList.map((t: any) => {
      // id dùng cho API (PUT/DELETE) → ưu tiên _id từ BE
      const id = t._id || t.issue_id || t.issue_key;
      const assigneeId = t.assignee_account_id || "__unassigned";
      // Xử lý sprint_id: có thể là string hoặc object { _id, name, state }
      const sprintId = typeof t.sprint_id === "object" && t.sprint_id?._id
        ? t.sprint_id._id
        : t.sprint_id || selectedPrint;
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
        deadline: t.due_date ? formatDateVN_yyyyMMdd(t.due_date) : "",
        startDate: t.start_date ? formatDateVN_yyyyMMdd(t.start_date) : undefined,
      };
    });

    setTasks(mapped);
  }, [teamTasksDataFinal, selectedPrint, currentTab]);

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
    if (deleteTarget.type === "task") {
      deleteTask(deleteTarget.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        },
      });
    } else {
      deleteSprint(deleteTarget.id, {
        onSuccess: () => {
          if (selectedPrint === deleteTarget.id) {
            const next = sprints.find((s) => s.id !== deleteTarget.id);
            setSelectedPrint(next?.id ?? "");
          }
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  const resetSprintForm = () => {
    setFormSprint({ 
      id: "", 
      name: "", 
      deadline: "",
      start_date: "",
      end_date: "",
    });
    setEditingSprint(null);
  };

  const handleSaveSprint = () => {
    if (!formSprint.name.trim()) {
      toast.error("Vui lòng nhập tên sprint");
      return;
    }
    if (!formSprint.start_date) {
      toast.error("Vui lòng chọn ngày bắt đầu sprint");
      return;
    }
    if (!formSprint.end_date) {
      toast.error("Vui lòng chọn ngày kết thúc sprint");
      return;
    }
    if (!resolvedTeamId) {
      toast.error("Không tìm thấy team ID");
      return;
    }

    // Nếu đang edit, gọi API PUT /sprints/:id
    if (editingSprint) {
      updateSprint(
        {
          sprintId: editingSprint.id,
          payload: {
            name: formSprint.name.trim(),
            start_date: formSprint.start_date,
            end_date: formSprint.end_date,
          },
        },
        {
          onSuccess: () => {
            setSprintDialogOpen(false);
            resetSprintForm();
          },
        }
      );
      return;
    }

    // Tạo sprint mới qua API
    createSprint(
      {
        team_id: resolvedTeamId,
        name: formSprint.name.trim(),
        start_date: formSprint.start_date,
        end_date: formSprint.end_date,
      },
      {
        onSuccess: () => {
          setSprintDialogOpen(false);
          resetSprintForm();
          // Sprints sẽ được refetch tự động sau khi tạo thành công
        },
      }
    );
  };

  const handleDeleteSprint = (id: string) => {
    const sprint = sprints.find((s) => s.id === id);
    if (!sprint) return;
    setDeleteTarget({ type: "sprint", id, name: sprint.name });
    setDeleteConfirmOpen(true);
  };

  const visibleTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.printId === selectedPrint)
        .filter((t) =>
          selectedAssigneeFilter === "all" ? true : t.assigneeId === selectedAssigneeFilter,
        ),
    [tasks, selectedPrint, selectedAssigneeFilter],
  );

  const currentSprint = useMemo(
    () => sprints.find((p) => p.id === selectedPrint),
    [sprints, selectedPrint],
  );
  const sprintOverdue = isDateOverdue(currentSprint?.deadline);
  const currentSprintMeta = sprintMetaMap[selectedPrint] || undefined;

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
          <p className="text-muted-foreground">
            Theo dõi danh sách task của từng thành viên
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <TaskBoardHeader
            sprints={sprints}
            selectedSprint={selectedPrint}
            onSprintChange={(v) => {
              setSelectedPrint(v);
              setFormTask((prev) => ({ ...prev, printId: v }));
            }}
            isSprintsLoading={isSprintsLoading}
            currentSprint={currentSprint}
            sprintOverdue={sprintOverdue}
            isLeader={isLeader}
            sprintMeta={currentSprintMeta}
            onAddSprint={() => {
              setEditingSprint(null);
              resetSprintForm();
              setSprintDialogOpen(true);
            }}
            onEditSprint={() => {
              if (!currentSprint) return;
              const meta = sprintMetaMap[currentSprint.id];
              setEditingSprint(currentSprint);
              setFormSprint({
                ...currentSprint,
                start_date: meta?.start_date ?? "",
                end_date: meta?.end_date ?? "",
              });
              setSprintDialogOpen(true);
            }}
            onDeleteSprint={() => {
              if (!currentSprint) return;
              handleDeleteSprint(currentSprint.id);
            }}
            onAddTask={() => {
              setEditingTask(null);
              resetTaskForm();
              setDialogOpen(true);
            }}
          />

          {/* Dropdown lọc theo thành viên (chỉ hiển thị khi ở tab board và là Leader) */}
          {currentTab === "board" && isLeader && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">Lọc theo thành viên:</span>
              <Select
                value={selectedAssigneeFilter}
                onValueChange={setSelectedAssigneeFilter}
              >
                <SelectTrigger className="h-8 w-[200px] text-xs">
                  <SelectValue placeholder="Tất cả thành viên" />
                </SelectTrigger>
                <SelectContent className="mt-15">
                  <SelectItem value="all" className="text-xs">
                    Tất cả thành viên
                  </SelectItem>
                  {members
                    .filter((m) => m.id !== "__unassigned")
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id} className="text-xs">
                        {m.name}
                      </SelectItem>
                    ))}
                  <SelectItem value="__unassigned" className="text-xs">
                    Unassigned
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
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

      {/* VIEW SWITCHER: TABLE / KANBAN */}
      <Tabs defaultValue="board" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="h-9 bg-slate-100 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-xl">
          <TabsTrigger value="board" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <KanbanSquare className="h-4 w-4" />
            Board
          </TabsTrigger>
          {isLeader && (
            <TabsTrigger value="table" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              <ListChecks className="h-4 w-4" />
              Bảng tất cả thành viên
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
            value="table"
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
            <MemberTableView
              members={tableMembers}
              tasks={tableTasks}
              isTaskOverdue={isTaskOverdue}
              isLeader={isLeader}
              currentUserId={currentUserId}
              onEditTask={(task) => {
                setEditingTask(task);
                setFormTask(task);
                setDialogOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              disableActions={true}
            />
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

      <SprintDialog
        open={sprintDialogOpen}
        onOpenChange={setSprintDialogOpen}
        editing={!!editingSprint}
        formSprint={formSprint}
        setFormSprint={setFormSprint}
        onSave={handleSaveSprint}
        isSaving={isCreatingSprint || isUpdatingSprint}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title={deleteTarget?.type === "sprint" ? "Xóa sprint" : "Xóa task"}
        description={
          deleteTarget?.type === "sprint"
            ? "Bạn chắc chắn muốn xóa sprint này? Các task trong sprint có thể bị ảnh hưởng."
            : "Bạn chắc chắn muốn xóa task này? Hành động này không thể hoàn tác."
        }
        itemName={deleteTarget?.name}
        subtitle={deleteTarget?.subtitle}
        onConfirm={handleConfirmDelete}
        isLoading={
          (deleteTarget?.type === "task" && isDeletingTask) ||
          (deleteTarget?.type === "sprint" && isDeletingSprint)
        }
      />
    </div>
  );
}


