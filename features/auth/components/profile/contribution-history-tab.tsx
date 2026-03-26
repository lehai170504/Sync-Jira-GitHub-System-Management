"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, GitCommit, ListChecks, ChevronDown, ExternalLink } from "lucide-react";
import { useMyCommits } from "@/features/integration/hooks/use-my-commits";
import { useMyTasksResponse } from "@/features/integration/hooks/use-my-tasks-response";

function formatDateTimeVN(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function formatDateVN(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function ContributionHistoryTab() {
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [commitLimit, setCommitLimit] = useState<number>(10);
  const [taskLimit, setTaskLimit] = useState<number>(10);

  const { data: myCommitsData, isLoading: isCommitsLoading, isError: isCommitsError } =
    useMyCommits();
  const {
    data: myTasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useMyTasksResponse(true);

  const projectOptions = useMemo(() => {
    const fromCommits = myCommitsData?.projects ?? [];
    const fromTasks = myTasksData?.projects ?? [];
    const merged = [...fromCommits, ...fromTasks];
    const map = new Map<string, { id: string; name: string }>();
    merged.forEach((p) => {
      if (p?.team_id) map.set(p.team_id, { id: p.team_id, name: p.name });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [myCommitsData, myTasksData]);

  const commitsFiltered = useMemo(() => {
    const commits = myCommitsData?.commits ?? [];
    const list =
      projectFilter === "ALL"
        ? commits
        : commits.filter((c) => c.team_id === projectFilter);
    return list.slice(0, commitLimit);
  }, [myCommitsData, projectFilter, commitLimit]);

  const commitsTotal = useMemo(() => {
    const commits = myCommitsData?.commits ?? [];
    return projectFilter === "ALL"
      ? commits.length
      : commits.filter((c) => c.team_id === projectFilter).length;
  }, [myCommitsData, projectFilter]);

  const tasksFiltered = useMemo(() => {
    const tasks = myTasksData?.tasks ?? [];
    const list =
      projectFilter === "ALL"
        ? tasks
        : tasks.filter((t) => t.team_id === projectFilter);
    return list.slice(0, taskLimit);
  }, [myTasksData, projectFilter, taskLimit]);

  const tasksTotal = useMemo(() => {
    const tasks = myTasksData?.tasks ?? [];
    return projectFilter === "ALL"
      ? tasks.length
      : tasks.filter((t) => t.team_id === projectFilter).length;
  }, [myTasksData, projectFilter]);

  return (
    <div className="space-y-6 font-sans">
      <Card className="border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Lịch sử đóng góp</CardTitle>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              Dự án:
            </span>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-9 w-[260px] text-xs border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-foreground">
                <SelectValue placeholder="Tất cả dự án" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectItem value="ALL" className="text-xs">
                  Tất cả dự án
                </SelectItem>
                {projectOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-[11px]">
              Commits: <span className="ml-1 font-semibold">{commitsTotal}</span>
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              Tasks: <span className="ml-1 font-semibold">{tasksTotal}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="commits" className="w-full">
            <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1.5 h-auto rounded-[20px] inline-flex border border-slate-200/50 dark:border-slate-800">
              <TabsTrigger value="commits" className="rounded-xl px-4 py-2 text-xs font-bold">
                <GitCommit className="h-4 w-4 mr-2" />
                Commits
              </TabsTrigger>
              <TabsTrigger value="tasks" className="rounded-xl px-4 py-2 text-xs font-bold">
                <ListChecks className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="commits" className="mt-4 space-y-3">
              {isCommitsLoading ? (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tải commits...
                </div>
              ) : isCommitsError ? (
                <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100">
                  <AlertTitle>Lỗi tải commits</AlertTitle>
                  <AlertDescription>
                    Không thể tải danh sách commits. Vui lòng thử lại.
                  </AlertDescription>
                </Alert>
              ) : commitsFiltered.length === 0 ? (
                <p className="text-sm text-muted-foreground italic py-4">
                  Chưa có commit nào.
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    {commitsFiltered.map((c) => (
                      <div
                        key={c.hash}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="font-mono text-[10px] px-2 py-0.5">
                                {c.hash.slice(0, 7)}
                              </Badge>
                              {c.branch && (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                  {c.branch}
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={
                                  "text-[10px] px-2 py-0.5 " +
                                  (c.is_counted
                                    ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300"
                                    : "border-slate-300 text-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300")
                                }
                              >
                                {c.is_counted ? "Counted" : "Not counted"}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm font-medium text-foreground whitespace-pre-wrap wrap-break-word">
                              {c.message}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                              <span>
                                {formatDateTimeVN(c.commit_date)}
                              </span>
                              <span className="truncate">
                                {c.author_email}
                              </span>
                              {c.rejection_reason && (
                                <span className="text-red-600 dark:text-red-300">
                                  {c.rejection_reason}
                                </span>
                              )}
                            </div>
                          </div>

                          {c.url && (
                            <Button asChild variant="ghost" size="icon" className="shrink-0">
                              <Link href={c.url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {commitsTotal > commitLimit && (
                    <div className="flex justify-center pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCommitLimit((v) => v + 10)}
                        className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Xem thêm
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="mt-4 space-y-3">
              {isTasksLoading ? (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tải tasks...
                </div>
              ) : isTasksError ? (
                <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100">
                  <AlertTitle>Lỗi tải tasks</AlertTitle>
                  <AlertDescription>
                    Không thể tải danh sách tasks. Vui lòng thử lại.
                  </AlertDescription>
                </Alert>
              ) : tasksFiltered.length === 0 ? (
                <p className="text-sm text-muted-foreground italic py-4">
                  Chưa có task nào.
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    {tasksFiltered.map((t) => {
                      const sprintName =
                        typeof t.sprint_id === "object" ? t.sprint_id?.name : "";
                      const sprintState =
                        typeof t.sprint_id === "object" ? t.sprint_id?.state : "";

                      return (
                        <div
                          key={t._id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-4 py-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="font-mono text-[10px] px-2 py-0.5">
                                  {t.issue_key || t.issue_id || t._id.slice(-6)}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                  {t.status_name || t.status_category || "—"}
                                </Badge>
                                {sprintName && (
                                  <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                    {sprintName}
                                    {sprintState ? ` • ${sprintState}` : ""}
                                  </Badge>
                                )}
                                <span className="text-[11px] text-muted-foreground">
                                  {t.story_point ?? 0} SP
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-medium text-foreground wrap-break-word">
                                {t.summary}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                                <span>
                                  Bắt đầu:{" "}
                                  <span className="font-medium text-foreground">
                                    {formatDateVN(t.start_date)}
                                  </span>
                                </span>
                                <span>
                                  Hạn:{" "}
                                  <span className="font-medium text-foreground">
                                    {formatDateVN(t.due_date)}
                                  </span>
                                </span>
                                {t.updated_at && (
                                  <span>
                                    Cập nhật: {formatDateTimeVN(t.updated_at)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {tasksTotal > taskLimit && (
                    <div className="flex justify-center pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTaskLimit((v) => v + 10)}
                        className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Xem thêm
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

