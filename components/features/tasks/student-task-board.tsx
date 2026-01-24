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
import { isDateOverdue, isTaskOverdue, nextSprintId, nextTaskNumber } from "./utils";
import { TaskBoardHeader } from "./task-board-header";
import { KanbanView } from "./kanban-view";
import { MemberTableView } from "./member-table-view";
import { TaskDialog } from "./task-dialog";
import { SprintDialog } from "./sprint-dialog";

export function TaskBoard() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id ?? "");
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [selectedPrint, setSelectedPrint] = useState<string>(initialSprints[0]?.id ?? "");

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
    printId: initialSprints[0]?.id ?? "",
    deadline: "",
  });

  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [formSprint, setFormSprint] = useState<Sprint>({
    id: "",
    name: "",
    deadline: "",
  });

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

  const resetSprintForm = () => {
    setFormSprint({ id: "", name: "", deadline: "" });
    setEditingSprint(null);
  };

  const handleSaveSprint = () => {
    if (!formSprint.name.trim()) {
      toast.error("Vui lòng nhập tên sprint");
      return;
    }
    if (!formSprint.deadline) {
      toast.error("Vui lòng chọn deadline sprint");
      return;
    }

    if (editingSprint) {
      setSprints((prev) =>
        prev.map((s) =>
          s.id === editingSprint.id ? { ...formSprint, id: editingSprint.id } : s,
        ),
      );
      toast.success("Đã cập nhật sprint");
    } else {
      const newId = nextSprintId(sprints);
      setSprints((prev) => [...prev, { ...formSprint, id: newId }]);
      if (!selectedPrint) setSelectedPrint(newId);
      toast.success("Đã thêm sprint mới");
    }

    setSprintDialogOpen(false);
    resetSprintForm();
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
          currentSprint={currentSprint}
          sprintOverdue={sprintOverdue}
          isLeader={isLeader}
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
      />
    </div>
  );
}


