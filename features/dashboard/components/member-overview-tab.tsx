"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Code2,
  TrendingUp,
  Loader2,
  GitCommit,
  Layers,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import { useTeamDashboard } from "@/features/management/teams/hooks/use-team-dashboard";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";

interface MemberOverviewTabProps {
  classId?: string;
}

export function MemberOverviewTab({ classId }: MemberOverviewTabProps) {
  const { data: myClasses, isPending: isClassesPending } = useMyClasses();

  const teamId = useMemo(() => {
    const classes = myClasses?.classes;
    if (!classes?.length) return undefined;
    if (classId) {
      return classes.find((cls) => cls.class._id === classId)?.team_id;
    }
    return classes[0].team_id;
  }, [myClasses, classId]);

  const { data: dashboardData, isLoading, error } = useTeamDashboard(teamId);

  if (isClassesPending || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!teamId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
        <Users className="w-12 h-12 opacity-20" />
        <p className="text-sm font-medium">Chưa tham gia nhóm nào trong lớp này.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-400 gap-3">
        <AlertCircle className="w-12 h-12 opacity-40" />
        <p className="text-sm font-medium">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { overview, team } = dashboardData;
  const tasks = overview.tasks;
  const commits = overview.commits;
  const sprints = overview.sprints;
  const donePercent = tasks.total > 0 ? Math.round((tasks.done / tasks.total) * 100) : 0;
  const spPercent = tasks.story_point_total > 0
    ? Math.round((tasks.story_point_done / tasks.story_point_total) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* === KPI GRID === */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Score Card */}
        <Card className="sm:col-span-2 lg:col-span-2 border-none bg-gradient-to-br from-[#F27124] to-[#e05a0a] text-white shadow-lg shadow-orange-200/40 dark:shadow-none rounded-[24px]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-orange-100 text-xs font-bold uppercase tracking-widest">
                  Điểm đóng góp cá nhân
                </p>
                <h2 className="text-5xl font-bold tracking-tight mt-2">
                  {(tasks.done_percent / 10).toFixed(1)}
                  <span className="text-2xl font-normal text-orange-200">/10</span>
                </h2>
                <p className="text-sm text-orange-100/80 mt-1">
                  {tasks.total === 0 ? "Chưa có task nào" : `${tasks.done_percent}% task đã hoàn thành`}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-5 space-y-1.5">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${donePercent}%` }}
                />
              </div>
              <p className="text-[10px] font-semibold text-orange-100/70 text-right">
                {donePercent}% DONE
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Jira Tasks */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[24px]">
          <CardContent className="p-6 flex justify-between items-start">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jira Tasks</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                {tasks.done}
                <span className="text-xl font-normal text-slate-400">/{tasks.total}</span>
              </h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Đã hoàn thành
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Commits */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[24px]">
          <CardContent className="p-6 flex justify-between items-start">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commits</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{commits.total}</h3>
              <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <Code2 className="h-3 w-3" /> Tổng đóng góp
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <GitCommit className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === DETAIL GRID === */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Story Points Progress */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[24px]">
          <CardHeader className="pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4" /> Story Points
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {tasks.story_point_done}
              <span className="text-xl font-normal text-slate-400">/{tasks.story_point_total}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F27124] rounded-full transition-all duration-700"
                  style={{ width: `${spPercent}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                {spPercent}% hoàn thành
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sprints */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[24px]">
          <CardHeader className="pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Sprint
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {sprints.active}
              <span className="text-xl font-normal text-slate-400">/{sprints.total}</span>
            </div>
            <Badge className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border-none ${sprints.active > 0
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}>
              {sprints.active > 0 ? `${sprints.active} đang hoạt động` : "Không có sprint"}
            </Badge>
          </CardContent>
        </Card>

        {/* Team Info */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[24px]">
          <CardHeader className="pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4" /> Nhóm dự án
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-3">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {team.project_name || "Chưa có tên"}
            </p>
            <div className="space-y-1.5">
              {commits.last_commit_date && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  🕐 Commit:{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(commits.last_commit_date).toLocaleDateString("vi-VN")}
                  </span>
                </p>
              )}
              {team.last_sync_at && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  🔄 Sync:{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(team.last_sync_at).toLocaleString("vi-VN")}
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === TASK STATUS BREAKDOWN === */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[24px]">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            Chi tiết công việc
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {tasks.total === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm font-medium">Chưa có task nào được giao.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Đã hoàn thành", value: tasks.done, color: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
                { label: "Chưa bắt đầu (To Do)", value: tasks.todo, color: "bg-slate-300 dark:bg-slate-600", badge: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
                { label: "Đang thực hiện", value: Math.max(0, tasks.total - tasks.done - tasks.todo), color: "bg-blue-500", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</p>
                  </div>
                  <Badge className={`text-[11px] font-bold px-3 py-1 rounded-full border-none ${row.badge}`}>
                    {row.value} task{row.value !== 1 ? "" : ""}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
