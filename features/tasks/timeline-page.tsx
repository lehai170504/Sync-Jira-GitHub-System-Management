"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useTeamSprints } from "@/features/management/teams/hooks/use-team-sprints";
import { useCreateSprint } from "@/features/management/teams/hooks/use-create-sprint";
import { useDeleteSprint } from "@/features/management/teams/hooks/use-delete-sprint";
import { useUpdateSprint } from "@/features/management/teams/hooks/use-update-sprint";
import { useStartSprint } from "@/features/management/teams/hooks/use-start-sprint";
import { Button } from "@/components/ui/button";
import { SprintTimelineView, parseDate } from "./sprint-timeline-view";
import type { SprintItem } from "./sprint-timeline-view";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { SprintDialog } from "./sprint-dialog";
import type { Sprint } from "./types";

export function TimelinePage() {
  const [isLeader, setIsLeader] = useState(false);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [formSprint, setFormSprint] = useState<Sprint>({
    id: "",
    name: "",
    deadline: "",
    start_date: "",
    end_date: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteSprintTarget, setDeleteSprintTarget] = useState<SprintItem | null>(null);

  const classId = Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  const { data: teamsData } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find((t: any) => t.project_name === myTeamName);
  const resolvedTeamId = myTeamInfo?._id || teamsData?.teams?.[0]?._id;
  const { data: teamSprintsData, isLoading: isSprintsLoading } =
    useTeamSprints(resolvedTeamId);

  // team_id để tạo sprint: ưu tiên từ class/team, fallback từ sprint đầu tiên đã load
  const teamIdForCreate =
    resolvedTeamId || (teamSprintsData?.[0] as { team_id?: string } | undefined)?.team_id || "";

  const { mutate: createSprint, isPending: isCreatingSprint } = useCreateSprint();
  const { mutate: deleteSprint, isPending: isDeletingSprint } = useDeleteSprint();
  const { mutate: updateSprint, isPending: isUpdatingSprint } = useUpdateSprint();
  const { mutateAsync: startSprintAsync, isPending: isStartingSprint } =
    useStartSprint();

  useEffect(() => {
    setIsLeader(Cookies.get("student_is_leader") === "true");
  }, []);

  const sprints: SprintItem[] = useMemo(() => {
    if (!teamSprintsData || teamSprintsData.length === 0) return [];
    return teamSprintsData.map((s: any) => {
      const id = s._id || s.id || `${s.name}-${s.start_date || ""}-${s.end_date || ""}`;
      const start = s.start_date
        ? s.start_date.includes("T")
          ? s.start_date
          : `${s.start_date}T00:00:00`
        : new Date().toISOString().slice(0, 10) + "T00:00:00";
      const end = s.end_date
        ? s.end_date.includes("T")
          ? s.end_date
          : `${s.end_date}T23:59:59`
        : new Date().toISOString();

      return {
        id,
        name: s.name,
        start,
        end,
        state: s.state,
        // BE Jira: sprint đã hoàn thành
        isCompleted: s.isCompleted,
      };
    });
  }, [teamSprintsData]);

  const handleEditSprint = (sprint: SprintItem) => {
    if (!sprint.id) return;
    const endDate = sprint.end ? new Date(sprint.end) : new Date();
    const deadline = !isNaN(endDate.getTime())
      ? endDate.toISOString().slice(0, 10)
      : "";
    setEditingSprint({
      id: sprint.id,
      name: sprint.name,
      deadline,
      start_date: sprint.start,
      end_date: sprint.end,
    });
    setFormSprint({
      id: sprint.id,
      name: sprint.name,
      deadline,
      start_date: sprint.start,
      end_date: sprint.end,
    });
    setSprintDialogOpen(true);
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

  const handleAddSprint = () => {
    resetSprintForm();
    setSprintDialogOpen(true);
  };

  const handleDeleteSprint = (sprint: SprintItem) => {
    if (!sprint.id) return;
    setDeleteSprintTarget(sprint);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteSprint = () => {
    if (!deleteSprintTarget?.id) return;
    deleteSprint(deleteSprintTarget.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setDeleteSprintTarget(null);
      },
    });
  };

  const handleStartSprint = async (sprint: SprintItem) => {
    if (!sprint.id) {
      toast.error("Không xác định được sprint để bắt đầu.");
      return;
    }
    const start = parseDate(sprint.start);
    const end = parseDate(sprint.end);
    if (!start || !end) {
      toast.error("Sprint thiếu ngày bắt đầu hoặc kết thúc.");
      return;
    }
    await startSprintAsync({
      sprintId: sprint.id,
      payload: {
        start_date: start.toISOString(),
        end_date: end.toISOString(),
      },
    });
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
    if (!teamIdForCreate) {
      toast.error("Không tìm thấy team. Vui lòng chọn lớp và team tại trang Danh sách lớp.");
      return;
    }

    const onSuccess = () => {
      setSprintDialogOpen(false);
      resetSprintForm();
    };

    if (editingSprint?.id) {
      updateSprint(
        {
          sprintId: editingSprint.id,
          payload: {
            name: formSprint.name.trim(),
            start_date: formSprint.start_date,
            end_date: formSprint.end_date,
          },
        },
        { onSuccess }
      );
    } else {
      createSprint(
        {
          team_id: teamIdForCreate,
          name: formSprint.name.trim(),
          start_date: formSprint.start_date,
          end_date: formSprint.end_date,
        },
        { onSuccess }
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent dark:from-cyan-500/20 dark:via-blue-500/10 p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
              Timeline Sprint
            </h1>
            <p className="text-sm text-muted-foreground">
              Xem lịch trình tất cả sprint theo tuần hoặc tháng
            </p>
          </div>
          {isLeader && (
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-400/60 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/80 dark:hover:bg-emerald-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleAddSprint}
              title="Thêm sprint"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm sprint
            </Button>
          )}
        </div>
      </div>

      {sprints.length === 0 && !isSprintsLoading && (
        <Alert className="rounded-xl border-amber-200/80 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/40 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
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

      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <SprintTimelineView
        sprints={sprints}
        isLeader={isLeader}
        onEditSprint={handleEditSprint}
        onDeleteSprint={handleDeleteSprint}
        onStartSprint={isLeader ? handleStartSprint : undefined}
        isStartingSprint={isStartingSprint}
      />
      </div>

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setDeleteSprintTarget(null);
        }}
        title="Xóa sprint"
        description="Bạn chắc chắn muốn xóa sprint này? Các task trong sprint có thể bị ảnh hưởng."
        itemName={deleteSprintTarget?.name}
        onConfirm={handleConfirmDeleteSprint}
        isLoading={isDeletingSprint}
      />

      <SprintDialog
        open={sprintDialogOpen}
        onOpenChange={(open) => {
          setSprintDialogOpen(open);
          if (!open) resetSprintForm();
        }}
        editing={!!editingSprint}
        formSprint={formSprint}
        setFormSprint={setFormSprint}
        onSave={handleSaveSprint}
        isSaving={isCreatingSprint || isUpdatingSprint}
      />
    </div>
  );
}
