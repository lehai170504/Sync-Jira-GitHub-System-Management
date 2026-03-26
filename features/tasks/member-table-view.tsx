"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { Member, Task } from "./types";

type Props = {
  members: Member[];
  tasks: Task[];
  isTaskOverdue: (task: Task) => boolean;
  isLeader: boolean;
  currentUserId: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask?: (task: Task) => void;
  disableActions?: boolean; // Nếu true, sẽ ẩn các nút edit và delete
  teamName?: string;
  totalMembers?: number;
  totalTasks?: number;
};

export function MemberTableView({
  members,
  tasks,
  isTaskOverdue,
  isLeader,
  currentUserId,
  onEditTask,
  onDeleteTask,
  onViewTask,
  disableActions = false,
  teamName,
  totalMembers,
  totalTasks,
}: Props) {
  const [openMembers, setOpenMembers] = useState<Record<string, boolean>>({});
  const [statusFilters, setStatusFilters] = useState<
    Record<string, "ALL" | "todo" | "in-progress" | "review" | "done">
  >({});

  const toggleMember = (id: string) => {
    setOpenMembers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDisplayDate = (value?: string) => {
    if (!value) return "";
    const d = value.includes("/") || value.includes("-")
      ? new Date(value)
      : new Date(value + "T00:00:00");
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-base">
          <span>Bảng tất cả thành viên</span>
          {(teamName || totalMembers != null || totalTasks != null) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {teamName && (
                <Badge variant="outline" className="border-slate-200 dark:border-slate-700">
                  Nhóm: <span className="ml-1 font-semibold">{teamName}</span>
                </Badge>
              )}
              {totalMembers != null && (
                <Badge variant="outline" className="border-slate-200 dark:border-slate-700">
                  Thành viên: <span className="ml-1 font-semibold">{totalMembers}</span>
                </Badge>
              )}
              {totalTasks != null && (
                <Badge variant="outline" className="border-slate-200 dark:border-slate-700">
                  Tổng task: <span className="ml-1 font-semibold">{totalTasks}</span>
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member, index) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          const isOpen = openMembers[member.id] ?? false;
          const statusFilter = statusFilters[member.id] ?? "ALL";
          const visibleTasks =
            statusFilter === "ALL"
              ? memberTasks
              : memberTasks.filter((t) => t.status === statusFilter);
          return (
            <div
              key={`${member.id}-${index}`}
              className="rounded-lg border bg-muted/30 p-3 space-y-2"
            >
              <button
                type="button"
                onClick={() => toggleMember(member.id)}
                className="w-full flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 border bg-background">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {memberTasks.length} task đang phụ trách
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {memberTasks.some((t) => t.status === "todo") && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-[11px] border-amber-300 text-amber-700 bg-amber-50"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Có task chưa bắt đầu
                    </Badge>
                  )}
                  <ChevronDown
                    className={
                      "h-4 w-4 text-muted-foreground transition-transform " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </div>
              </button>

              {isOpen && (
                <div className="mt-2 space-y-2">
                  {/* Bộ lọc status cho từng thành viên */}
                  {memberTasks.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-muted-foreground">Lọc theo trạng thái:</span>
                      {[
                        { key: "ALL" as const, label: "Tất cả" },
                        { key: "todo" as const, label: "To Do" },
                        { key: "in-progress" as const, label: "In Progress" },
                        { key: "review" as const, label: "In Review" },
                        { key: "done" as const, label: "Done" },
                      ].map((opt) => (
                        <Button
                          key={opt.key}
                          type="button"
                          variant={statusFilter === opt.key ? "default" : "outline"}
                          size="xs"
                          className={
                            "h-6 px-2 text-[11px]" +
                            (statusFilter === opt.key
                              ? " bg-primary text-primary-foreground"
                              : " bg-background")
                          }
                          onClick={() =>
                            setStatusFilters((prev) => ({
                              ...prev,
                              [member.id]: opt.key,
                            }))
                          }
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {visibleTasks.length === 0 && (
                    <p className="text-[11px] text-muted-foreground italic">
                      Chưa có task nào được assign.
                    </p>
                  )}
                  {visibleTasks.map((task, index) => {
                  const overdue = isTaskOverdue(task);
                  const canEdit = isLeader || task.assigneeId === currentUserId;
                  const canDelete = isLeader || task.assigneeId === currentUserId;
                  return (
                    <div
                      key={`${task.id}-${index}`}
                      className={
                        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs rounded-lg px-4 py-3 border transition-colors cursor-pointer " +
                        (overdue
                          ? "border-red-200 bg-red-50/70 hover:bg-red-50 dark:border-red-900 dark:bg-red-950/30 dark:hover:bg-red-950/40"
                          : "border-slate-100 bg-background hover:bg-slate-50 dark:hover:bg-slate-800/60")
                      }
                      onClick={() => onViewTask?.(task)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`font-mono text-[10px] px-1.5 py-0.5 ${
                              task.status === "done" ? "line-through opacity-70" : ""
                            }`}
                          >
                            {task.key ?? task.id}
                          </Badge>
                          <span className="font-medium">
                            {task.title}
                          </span>
                          {overdue && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0.5 border-red-400 text-red-600 bg-red-50 dark:border-red-900 dark:text-red-400 dark:bg-red-950/40"
                            >
                              Quá hạn
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                          {task.sprintName && (
                            <span className="flex items-center gap-1.5">
                              Sprint:{" "}
                              <span className="font-medium">{task.sprintName}</span>
                              {task.sprintState && (
                                <Badge
                                  variant="outline"
                                  className={
                                    "text-[9px] px-1 py-0 " +
                                    (task.sprintState === "active"
                                      ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                                      : task.sprintState === "closed"
                                      ? "border-slate-300 text-slate-500 bg-slate-50 dark:bg-slate-800 opacity-70"
                                      : "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40")
                                  }
                                >
                                  {task.sprintState === "active"
                                    ? "Đang chạy"
                                    : task.sprintState === "closed"
                                    ? "Đã đóng"
                                    : "Sắp tới"}
                                </Badge>
                              )}
                            </span>
                          )}
                          {task.startDate && (
                            <span>
                              Bắt đầu:{" "}
                              <span className="font-medium">
                                {formatDisplayDate(task.startDate)}
                              </span>
                            </span>
                          )}
                          <span>
                            Hạn:{" "}
                            <span className="font-medium">
                              {task.deadline ? formatDisplayDate(task.deadline) : "—"}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            "text-[10px] px-1.5 py-0.5 " +
                            (task.status === "done"
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                              : task.status === "in-progress"
                              ? "border-blue-300 text-blue-700 bg-blue-50"
                              : task.status === "review"
                              ? "border-amber-300 text-amber-700 bg-amber-50"
                              : "border-slate-300 text-slate-700 bg-slate-50")
                          }
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
                        {!disableActions && canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {!disableActions && canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}


