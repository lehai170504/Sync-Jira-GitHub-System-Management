"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Course, Sprint } from "./types";

type Props = {
  courses: Course[];
  selectedCourse: string;
  onCourseChange: (courseId: string) => void;

  sprints: Sprint[];
  selectedSprint: string;
  onSprintChange: (sprintId: string) => void;
  isSprintsLoading?: boolean;

  currentSprint?: Sprint;
  sprintOverdue: boolean;
  isLeader: boolean;
  sprintMeta?: {
    start_date?: string;
    end_date?: string;
    state?: string;
  };
  onAddSprint: () => void;
  onEditSprint: () => void;
  onDeleteSprint: () => void;

  onAddTask: () => void;
};

export function TaskBoardHeader({
  courses,
  selectedCourse,
  onCourseChange,
  sprints,
  selectedSprint,
  onSprintChange,
  isSprintsLoading = false,
  currentSprint,
  sprintOverdue,
  isLeader,
  sprintMeta,
  onAddSprint,
  onEditSprint,
  onDeleteSprint,
  onAddTask,
}: Props) {
  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={selectedCourse} onValueChange={onCourseChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Chọn môn học" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedSprint}
        onValueChange={onSprintChange}
        disabled={isSprintsLoading || sprints.length === 0}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Chọn sprint" />
        </SelectTrigger>
        <SelectContent>
          {isSprintsLoading ? (
            <SelectItem value="__loading" disabled>
              Đang tải sprint...
            </SelectItem>
          ) : (
            sprints.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} • {p.deadline}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {currentSprint && (
        <div className="flex items-center gap-2">
          {isLeader && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-800"
                onClick={onEditSprint}
                title="Sửa sprint"
              >
                <Pencil className="h-4 w-4 mr-1" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                onClick={onDeleteSprint}
                title="Xóa sprint"
              >
                <Trash2 className="h-4 w-4 mr-1" />
              </Button>
            </>
          )}
          {sprintOverdue && (
            <Badge variant="destructive" className="text-[11px]">
              Quá hạn
            </Badge>
          )}
        </div>
      )}

      {isLeader && (
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          onClick={onAddSprint}
          title="Thêm sprint"
        >
          <Plus className="h-4 w-4 mr-1" />
          Thêm sprint
        </Button>
      )}

      <Button
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700"
        onClick={onAddTask}
      >
        <Plus className="h-4 w-4 mr-1" />
        Thêm task
      </Button>

      {currentSprint && sprintMeta && (
        <div className="flex flex-col gap-1 text-xs text-muted-foreground ml-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Trạng thái:</span>
            <Badge
              variant={
                sprintMeta.state === "active"
                  ? "default"
                  : sprintMeta.state === "closed"
                    ? "destructive"
                    : "outline"
              }
              className={
                sprintMeta.state === "active"
                  ? "bg-emerald-500 text-white"
                  : sprintMeta.state === "closed"
                    ? "bg-red-500 text-white"
                  : "border-slate-300"
              }
            >
              {sprintMeta.state || "unknown"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Bắt đầu: <span className="font-medium">{formatDate(sprintMeta.start_date)}</span>
            </span>
            <span>
              Kết thúc: <span className="font-medium">{formatDate(sprintMeta.end_date)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


