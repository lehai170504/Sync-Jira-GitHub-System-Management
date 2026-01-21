"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import type { Member, Task } from "./types";

type Props = {
  members: Member[];
  tasks: Task[];
  isTaskOverdue: (task: Task) => boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

export function MemberTableView({
  members,
  tasks,
  isTaskOverdue,
  onEditTask,
  onDeleteTask,
}: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Task theo thành viên
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          return (
            <div
              key={member.id}
              className="rounded-lg border bg-muted/30 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 border bg-background">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {memberTasks.length} task đang phụ trách
                    </p>
                  </div>
                </div>
                {memberTasks.some((t) => t.status === "todo") && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-[11px] border-amber-300 text-amber-700 bg-amber-50"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Có task chưa bắt đầu
                  </Badge>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {memberTasks.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa có task nào được assign.
                  </p>
                )}
                {memberTasks.map((task) => {
                  const overdue = isTaskOverdue(task);
                  return (
                    <div
                      key={task.id}
                      className={
                        "flex items-center justify-between text-xs bg-background rounded-md px-2 py-1 border " +
                        (overdue
                          ? "border-red-300 bg-red-50/60"
                          : "border-slate-100")
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {task.id}
                        </span>
                        <span className="font-medium">{task.title}</span>
                        {overdue && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0.5 border-red-400 text-red-600"
                          >
                            Quá hạn
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0.5"
                        >
                          {task.status === "todo"
                            ? "To Do"
                            : task.status === "in-progress"
                            ? "In Progress"
                            : task.status === "review"
                            ? "In Review"
                            : "Done"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {task.storyPoints} SP
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEditTask(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700"
                          onClick={() => onDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}


