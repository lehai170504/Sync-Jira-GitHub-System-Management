"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, GripVertical, Pencil, Trash2 } from "lucide-react";
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
                  const isDragging = draggedTaskId === task.id;
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
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          {onTaskStatusChange && (
                            <div className="text-muted-foreground shrink-0" aria-hidden>
                              <GripVertical className="h-4 w-4" />
                            </div>
                          )}
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {task.id}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0.5"
                          >
                            {task.type}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold leading-snug">
                          {task.title}
                        </p>
                        {overdue && (
                          <div className="flex items-center gap-1 text-[11px] text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Quá hạn deadline</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border">
                              <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
                                {assignee?.initials ?? "NA"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {assignee?.name ?? "Unassigned"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0.5"
                            >
                              {task.storyPoints} SP
                            </Badge>
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onEditTask(task)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {isLeader && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className={canEdit ? "-ml-3 h-7 w-7" : "h-7 w-7 text-red-600 hover:text-red-700"}
                                onClick={() => onDeleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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


