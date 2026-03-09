"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Calendar, CheckCircle2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Member, StatusColumn, Task, TaskStatus } from "./types";

type Props = {
  statusColumns: StatusColumn[];
  tasks: Task[];
  members: Member[];
  isTaskOverdue: (task: Task) => boolean;
  isLeader: boolean;
  currentUserId: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask?: (task: Task) => void;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
};

export function KanbanView({
  statusColumns,
  tasks,
  members,
  isTaskOverdue,
  isLeader,
  currentUserId,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onTaskStatusChange,
}: Props) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<TaskStatus | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragOverColumnId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumnId(columnId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumnId(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnId: TaskStatus) => {
      e.preventDefault();
      setDragOverColumnId(null);
      const taskId = e.dataTransfer.getData("text/plain");
      if (!taskId || !onTaskStatusChange) return;
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.status === targetColumnId) return;
      onTaskStatusChange(taskId, targetColumnId);
    },
    [tasks, onTaskStatusChange],
  );

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-visible rounded-lg border bg-muted/30 p-4">
      <div className="flex gap-4 min-w-max">
        {statusColumns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`w-[260px] shrink-0 rounded-xl bg-background border ${col.color} shadow-sm flex flex-col transition-colors ${
                dragOverColumnId === col.id ? "ring-2 ring-primary/50 bg-primary/5" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="px-4 pt-3 pb-2 border-b flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {col.title}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {col.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                >
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="p-3 space-y-3 min-h-[120px]">
                {columnTasks.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa có task nào.
                  </p>
                )}
                {columnTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const overdue = isTaskOverdue(task);
                  const canEdit = isLeader || task.assigneeId === currentUserId;
                  const canDelete = isLeader || task.assigneeId === currentUserId;
                  const isDragging = draggedTaskId === task.id;
                  const isDone = task.status === "done";
                  return (
                    <Card
                      key={task.id}
                      data-task-card
                      draggable={!!onTaskStatusChange}
                      onDragStart={(e) => {
                        if (!onTaskStatusChange) return;
                        handleDragStart(e, task.id);
                        const card = e.currentTarget;
                        if (card instanceof HTMLElement) {
                          e.dataTransfer.setDragImage(card, 0, 0);
                        }
                      }}
                      onDragEnd={handleDragEnd}
                      className={
                        "shadow-xs hover:shadow-md transition-shadow select-none " +
                        (overdue
                          ? "border border-red-300 bg-red-50"
                          : "border border-slate-200") +
                        (isDragging ? " opacity-50" : "") +
                        (onTaskStatusChange ? " cursor-grab active:cursor-grabbing" : "")
                      }
                    >
                      <CardContent className="p-3 space-y-2.5">
                        {/* Row 1: Title + Edit + Delete */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <p
                              className={`text-sm font-semibold leading-snug truncate ${onViewTask ? "cursor-pointer hover:text-primary" : ""}`}
                              onClick={(e) => { e.stopPropagation(); onViewTask?.(task); }}
                              role={onViewTask ? "button" : undefined}
                            >
                              {task.title}
                            </p>
                            {canEdit && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
                                className="shrink-0 p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                aria-label="Chỉnh sửa"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                className="shrink-0 p-0.5 rounded hover:bg-red-50 text-red-600 hover:text-red-700"
                                aria-label="Xóa"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Row 2: Due date pill */}
                        {task.deadline && (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground text-[11px]">
                              <Calendar className="h-3 w-3" />
                              {formatDueDate(task.deadline)}
                            </span>
                          </div>
                        )}

                        {/* Row 3: Checkbox + Task key + Story points + Assignee */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className={`text-[11px] font-mono text-muted-foreground ${task.status === "done" ? "line-through" : ""}`}>
                            {task.key ?? task.id}
                          </span>
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded bg-muted text-[11px] font-medium">
                            {task.storyPoints}
                          </span>
                          <span className="text-muted-foreground mx-0.5">=</span>
                          <Avatar className="h-6 w-6 shrink-0 border">
                            <AvatarFallback className="text-[9px] bg-teal-500/20 text-teal-700 dark:bg-teal-400/20 dark:text-teal-300 font-semibold">
                              {assignee?.initials ?? "NA"}
                            </AvatarFallback>
                          </Avatar>
                          {task.status === "done" && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


