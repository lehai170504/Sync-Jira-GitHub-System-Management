"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanSquare, LayoutDashboard, ListChecks } from "lucide-react";
import { toast } from "sonner";

import { courses, initialSprints, initialTasks, members, statusColumns } from "./mock-data";
import type { Sprint, Task } from "./types";
import { isDateOverdue, isTaskOverdue, nextTaskNumber } from "./utils";
import { TaskBoardHeader } from "./task-board-header";
import { KanbanView } from "./kanban-view";
import { MemberTableView } from "./member-table-view";
import { TaskDialog } from "./task-dialog";
import { SprintDialog } from "./sprint-dialog";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import { useTeamSprints } from "@/features/management/teams/hooks/use-team-sprints";
import { useCreateSprint } from "@/features/management/teams/hooks/use-create-sprint";

export function TaskBoard() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id ?? "");
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [selectedPrint, setSelectedPrint] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTask, setFormTask] = useState<Task>({
    id: "",
    title: "",
    assigneeId: members[0]?.id ?? "",
    status: "todo",
    storyPoints: 1,
    priority: "Medium",
    type: "General",
    courseId: courses[0]?.id ?? "",
    printId: "",
    deadline: "",
  });

  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
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
  
  // Hook để tạo sprint mới
  const { mutate: createSprint, isPending: isCreatingSprint } = useCreateSprint();

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

  // Cập nhật sprints state từ API (fallback về mock nếu API rỗng)
  useEffect(() => {
    if (apiSprints.length > 0) {
      setSprints(apiSprints);
    } else {
      setSprints(initialSprints);
    }
  }, [apiSprints]);

  // Default chọn sprint: ưu tiên sprint active (nếu có), fallback sprint đầu tiên
  useEffect(() => {
    if (!sprints || sprints.length === 0) return;

    const exists = !!selectedPrint && sprints.some((sp) => sp.id === selectedPrint);
    if (exists) return;

    const activeFromApi = teamSprintsData?.find((s: any) => s.state === "active");
    const activeId = activeFromApi
      ? activeFromApi._id ||
        activeFromApi.id ||
        `${activeFromApi.name}-${activeFromApi.start_date || ""}-${activeFromApi.end_date || ""}`
      : undefined;

    const nextSelected = activeId && sprints.some((sp) => sp.id === activeId) ? activeId : sprints[0].id;
    setSelectedPrint(nextSelected);
    setFormTask((prev) => ({ ...prev, printId: nextSelected }));
  }, [sprints, selectedPrint, teamSprintsData]);

  // Lấy current user ID (giả sử MEMBER có ID "m2", LEADER có thể là "m1")
  const [currentUserId, setCurrentUserId] = useState<string>("m2");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeaderState(leaderStatus);

    // Mock logic user ID
    if (leaderStatus) {
      setCurrentUserId("m1");
    } else {
      setCurrentUserId("m2");
    }
  }, []);

  const isLeader = isLeaderState;

  const resetTaskForm = () => {
    const defaultAssigneeId = isLeader ? members[0]?.id ?? "" : currentUserId;
    setFormTask({
      id: "",
      title: "",
      assigneeId: defaultAssigneeId,
      status: "todo",
      storyPoints: 1,
      priority: "Medium",
      type: "General",
      courseId: selectedCourse || courses[0]?.id || "",
      printId: selectedPrint || sprints[0]?.id || "",
      deadline: "",
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
    if (!formTask.courseId) {
      toast.error("Vui lòng chọn môn học");
      return;
    }
    if (!formTask.printId) {
      toast.error("Vui lòng chọn sprint");
      return;
    }
    if (!formTask.deadline) {
      toast.error("Vui lòng chọn deadline cho task");
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
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...formTask, id: editingTask.id } : t,
        ),
      );
      toast.success("Đã cập nhật task");
    } else {
      const newId = `T-${nextTaskNumber(tasks)}`;
      setTasks((prev) => [...prev, { ...formTask, id: newId }]);
      toast.success("Đã thêm task mới");
    }

    setDialogOpen(false);
    resetTaskForm();
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const ok = window.confirm(`Bạn chắc chắn muốn xóa task ${task.id}?`);
    if (!ok) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Đã xóa task");
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

    // Nếu đang edit, giữ logic cũ (chưa có API update)
    if (editingSprint) {
      setSprints((prev) =>
        prev.map((s) =>
          s.id === editingSprint.id ? { ...formSprint, id: editingSprint.id } : s,
        ),
      );
      toast.success("Đã cập nhật sprint");
      setSprintDialogOpen(false);
      resetSprintForm();
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
    const ok = window.confirm(`Bạn chắc chắn muốn xóa sprint "${sprint.name}"?`);
    if (!ok) return;

    setSprints((prev) => prev.filter((s) => s.id !== id));
    if (selectedPrint === id) {
      const next = sprints.find((s) => s.id !== id);
      setSelectedPrint(next?.id ?? "");
    }
    toast.success("Đã xóa sprint");
  };

  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (t) => t.courseId === selectedCourse && t.printId === selectedPrint,
      ),
    [tasks, selectedCourse, selectedPrint],
  );

  const currentSprint = useMemo(
    () => sprints.find((p) => p.id === selectedPrint),
    [sprints, selectedPrint],
  );
  const sprintOverdue = isDateOverdue(currentSprint?.deadline);
  const currentSprintMeta = sprintMetaMap[selectedPrint] || undefined;

  // NOTE: Sprints được lấy từ Jira nên không cho thao tác CRUD thủ công tại UI /tasks.

  // Trang này dành cho Sinh viên
  if (role !== "STUDENT" && role !== "LEADER" && role !== "MEMBER") {
    // Logic cũ check LEADER/MEMBER
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
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

        <TaskBoardHeader
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseChange={(v) => {
            setSelectedCourse(v);
            setFormTask((prev) => ({ ...prev, courseId: v }));
          }}
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
            setEditingSprint(currentSprint);
            setFormSprint(currentSprint);
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
      </div>

      <Separator />

      {currentSprint && sprintOverdue && (
        <Alert className="bg-red-50 border-red-200 text-red-900">
          <AlertTitle>Đã quá hạn deadline sprint</AlertTitle>
          <AlertDescription>
            Sprint <b>{currentSprint.name}</b> đã quá hạn ngày{" "}
            <b>{currentSprint.deadline}</b>. Vui lòng rà soát lại các task chưa hoàn thành.
          </AlertDescription>
        </Alert>
      )}

      {/* VIEW SWITCHER: TABLE / KANBAN */}
      <Tabs defaultValue="board" className="space-y-4">
        <TabsList className="h-9">
          <TabsTrigger value="board" className="flex items-center gap-2">
            <KanbanSquare className="h-4 w-4" />
            Board
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Bảng theo thành viên
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="board"
          className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
        >
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
          />
        </TabsContent>

        <TabsContent
          value="table"
          className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
        >
          <MemberTableView
            members={members}
            tasks={visibleTasks}
            isTaskOverdue={isTaskOverdue}
            isLeader={isLeader}
            currentUserId={currentUserId}
            onEditTask={(task) => {
              setEditingTask(task);
              setFormTask(task);
              setDialogOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={!!editingTask}
        formTask={formTask}
        setFormTask={setFormTask}
        onSave={handleSaveTask}
        members={members}
        courses={courses}
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
        isSaving={isCreatingSprint}
      />

    </div>
  );
}


