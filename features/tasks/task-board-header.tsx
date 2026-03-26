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
import { Plus } from "lucide-react";
import type { Sprint } from "./types";

const ALL_SPRINTS_VALUE = "__all_sprints__";

type Props = {
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
  onAddTask: () => void;
};

export function TaskBoardHeader({
  sprints,
  selectedSprint,
  onSprintChange,
  isSprintsLoading = false,
  currentSprint,
  sprintOverdue,
  isLeader,
  sprintMeta,
  onAddTask,
}: Props) {
  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
      <Select
        value={selectedSprint}
        onValueChange={onSprintChange}
        disabled={isSprintsLoading || sprints.length === 0}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Chọn sprint" />
        </SelectTrigger>
        <SelectContent className="mt-18 max-h-[320px] overflow-y-auto">
          {isSprintsLoading ? (
            <SelectItem value="__loading" disabled>
              Đang tải sprint...
            </SelectItem>
          ) : (
            <>
              {sprints.length > 0 && (
                <SelectItem value={ALL_SPRINTS_VALUE}>All Sprints</SelectItem>
              )}
              {sprints.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>

      {currentSprint && (
        <div className="flex items-center gap-2">
          {sprintOverdue && (
            <Badge variant="destructive" className="text-[11px]">
              Quá hạn
            </Badge>
          )}
        </div>
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

      {currentSprint && sprintMeta && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Bắt đầu: <span className="font-medium">{formatDate(sprintMeta.start_date)}</span>
          </span>
          <span>
            Kết thúc: <span className="font-medium">{formatDate(sprintMeta.end_date)}</span>
          </span>
        </div>
      )}
    </div>
  );
}


