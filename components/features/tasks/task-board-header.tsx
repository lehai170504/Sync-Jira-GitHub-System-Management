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

  currentSprint?: Sprint;
  sprintOverdue: boolean;
  isLeader: boolean;
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
  currentSprint,
  sprintOverdue,
  isLeader,
  onAddSprint,
  onEditSprint,
  onDeleteSprint,
  onAddTask,
}: Props) {
  return (
    <div className="flex items-center gap-2">
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

      <Select value={selectedSprint} onValueChange={onSprintChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Chọn sprint" />
        </SelectTrigger>
        <SelectContent>
          {sprints.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name} • {p.deadline}
            </SelectItem>
          ))}
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
    </div>
  );
}


