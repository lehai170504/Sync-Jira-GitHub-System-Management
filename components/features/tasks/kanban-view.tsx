"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import type { Member, StatusColumn, Task } from "./types";

type Props = {
  statusColumns: StatusColumn[];
  tasks: Task[];
  members: Member[];
  isTaskOverdue: (task: Task) => boolean;
  isLeader: boolean;
  currentUserId: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
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
}: Props) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-muted/30 p-4">
      <div className="flex gap-4 min-w-max">
        {statusColumns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`w-[260px] shrink-0 rounded-xl bg-background border ${col.color} shadow-sm flex flex-col`}
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

              <div className="p-3 space-y-3">
                {columnTasks.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa có task nào.
                  </p>
                )}
                {columnTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const overdue = isTaskOverdue(task);
                  const canEdit = isLeader || task.assigneeId === currentUserId;
                  return (
                    <Card
                      key={task.id}
                      className={
                        "shadow-xs hover:shadow-md transition-shadow " +
                        (overdue
                          ? "border border-red-300 bg-red-50"
                          : "border border-slate-200")
                      }
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
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
    </ScrollArea>
  );
}


