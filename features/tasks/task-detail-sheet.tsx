"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Code2, FileText, GitCommit, Calendar, Pencil } from "lucide-react";
import type { Task } from "./types";
import type { Member } from "./types";
import { useJiraIssueCommits } from "@/features/integration/hooks/use-jira-issue-commits";
import { mapStatusToStatusName } from "./utils";
import type { TaskStatus } from "./types";

function getStatusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    case "review":
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
    case "done":
      return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
  }
}

interface TaskDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  members: Member[];
  projectId: string | undefined;
  onEditTask?: (task: Task) => void;
}

export function TaskDetailSheet({
  open,
  onOpenChange,
  task,
  members,
  projectId,
  onEditTask,
}: TaskDetailSheetProps) {
  const issueKey = task?.key;
  const { data, isLoading, isError } = useJiraIssueCommits(
    issueKey,
    projectId ?? undefined,
    open && !!issueKey && !!projectId,
  );

  const commits = data?.commits ?? [];
  const assignee = task ? members.find((m) => m.id === task.assigneeId) : null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
      .format(d)
      .replaceAll("/", "-");
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] sm:max-w-[500px] overflow-hidden flex flex-col gap-4 p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <SheetHeader className="border-b pb-4 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg text-foreground">{task.title}</SheetTitle>
            {task.key && (
              <Badge variant="outline" className="font-mono text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300">
                {task.key}
              </Badge>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {task.description}
            </p>
          )}
        </SheetHeader>

        <Tabs defaultValue="summary" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 shrink-0 mx-1">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="development" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Development
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 overflow-hidden pt-4">
            <TabsContent value="summary" className="m-0 h-full">
              <ScrollArea className="h-full">
                <div className="space-y-5 pr-3">
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-sm text-muted-foreground min-w-[100px]">Trạng thái:</span>
                    <Badge variant="outline" className={getStatusBadgeClass(task.status)}>
                      {mapStatusToStatusName(task.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-sm text-muted-foreground min-w-[100px]">Story points:</span>
                    <span className="font-medium text-foreground">{task.storyPoints}</span>
                  </div>
                  {(task.sprintName || task.printId) && (
                    <div className="flex items-center gap-3 flex-wrap py-1">
                      <span className="text-sm text-muted-foreground min-w-[100px]">Sprint:</span>
                      <span className="font-medium text-foreground">{task.sprintName || task.printId}</span>
                      {task.sprintState && (
                        <Badge
                          variant="outline"
                          className={
                            "text-[10px] px-1.5 py-0.5 " +
                            (task.sprintState === "active"
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 animate-pulse"
                              : task.sprintState === "closed"
                              ? "border-slate-300 text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400 opacity-70"
                              : "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300")
                          }
                        >
                          {task.sprintState === "active"
                            ? "Đang chạy"
                            : task.sprintState === "closed"
                            ? "Đã đóng"
                            : "Sắp tới"}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-sm text-muted-foreground min-w-[100px]">Assignee:</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700">
                        <AvatarFallback className="text-xs bg-teal-500/15 text-teal-700 dark:bg-teal-400/20 dark:text-teal-100">
                          {assignee?.initials ?? "NA"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{assignee?.name ?? "—"}</span>
                    </div>
                  </div>
                  {task.deadline && (
                    <div className="flex items-center gap-3 py-1">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground">Hạn:</span>
                      <span className="text-sm text-foreground">{formatDate(task.deadline)}</span>
                    </div>
                  )}
                  {onEditTask && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onOpenChange(false);
                        onEditTask(task);
                      }}
                      className="mt-2 w-fit gap-2 border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      <Pencil className="h-4 w-4" />
                      Chỉnh sửa task
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="development" className="m-0 h-full">
              <ScrollArea className="h-full">
                <div className="space-y-5 pr-3">
                  <p className="text-sm text-muted-foreground">
                    Lịch sử code – commits liên kết với {task.key} qua Smart Linking.
                  </p>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">Đang tải commits...</span>
                    </div>
                  ) : isError ? (
                    <p className="text-sm text-red-600 dark:text-red-400 py-4">
                      Không thể tải danh sách commits.
                    </p>
                  ) : commits.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8">
                      Chưa có commit nào liên kết với issue này.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {commits.map((c) => (
                        <li
                          key={c.hash}
                          className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-sm text-foreground overflow-hidden"
                        >
                          <GitCommit className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <code className="text-xs font-mono text-primary bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded">
                            {c.hash?.substring(0, 7)}
                          </code>
                          <span className="truncate flex-1 min-w-0 text-foreground">{c.message}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDate(c.commit_date)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
