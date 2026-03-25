"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useTeamRanking } from "@/features/management/teams/hooks/use-team-ranking";
import { useTeamLeaderboardRealtime } from "@/features/management/teams/hooks/use-team-leaderboard-rt";

// Helper function để lấy initials từ tên
const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function LeaderProgressPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeader, setIsLeader] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openMembers, setOpenMembers] = useState<Record<string, boolean>>({});
  const warnedMissingLeaderboardFieldsRef = useRef(false);

  // Resolve teamId giống trang /tasks và /config
  const classId = Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  const { data: teamsData } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find((t: any) => t.project_name === myTeamName);
  const resolvedTeamId = myTeamInfo?._id || teamsData?.teams?.[0]?._id;

  // Fetch ranking data từ API
  const { data: rankingData, isLoading, error } = useTeamRanking(resolvedTeamId);
  const { data: leaderboardRt } = useTeamLeaderboardRealtime(resolvedTeamId);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeader(leaderStatus);
    setMounted(true);
  }, []);

  const contributionPercentByMemberId = useMemo(() => {
    const rows = leaderboardRt?.leaderboard;
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const map = new Map<string, number>();

    for (const raw of rows) {
      const r: any = raw;
      const memberId: string | undefined =
        r?.member_id ?? r?.memberId ?? r?.team_member_id ?? r?.teamMemberId;

      const percentRaw =
        r?.contribution_percent ??
        r?.contributionPercent ??
        r?.contribution_percentage ??
        r?.contributionPercentage ??
        r?.percent ??
        r?.percentage;

      const percent =
        typeof percentRaw === "number"
          ? percentRaw
          : typeof percentRaw === "string"
            ? Number(percentRaw)
            : NaN;

      if (memberId && Number.isFinite(percent)) {
        map.set(memberId, percent);
      }
    }

    if (map.size === 0) return { map, ok: false as const };
    return { map, ok: true as const };
  }, [leaderboardRt]);

  useEffect(() => {
    if (!contributionPercentByMemberId) return;
    if (contributionPercentByMemberId.ok) return;
    if (warnedMissingLeaderboardFieldsRef.current) return;
    warnedMissingLeaderboardFieldsRef.current = true;
    toast.warning("Payload LEADERBOARD_UPDATED thiếu field để map % đóng góp", {
      description:
        "Cần `member_id` (hoặc tương đương) và `contribution_percent` (hoặc tương đương) cho từng entry.",
    });
  }, [contributionPercentByMemberId]);

  // Map API data sang format cho UI
  const memberProgress = useMemo(() => {
    if (!rankingData?.ranking) return [];
    
    return rankingData.ranking.map((member) => {
      const studentName = member.student?.full_name || `Member ${member.member_id.slice(-4)}`;
      const initials = getInitials(studentName);
      // Tính progress: done_tasks / total_tasks * 100 (nếu total_tasks > 0)
      const progress = member.jira.total_tasks > 0
        ? Math.round((member.jira.done_tasks / member.jira.total_tasks) * 100)
        : 0;

      const contributionPercent =
        contributionPercentByMemberId && contributionPercentByMemberId.ok
          ? contributionPercentByMemberId.map.get(member.member_id)
          : undefined;
      
      return {
        id: member.member_id,
        name: studentName,
        initials,
        email: member.student?.email || "",
        studentCode: member.student?.student_code || "",
        jiraAccountId: member.mapping?.jira_account_id || "",
        githubUsername: member.mapping?.github_username || "",
        progress,
        tasksDone: member.jira.done_tasks,
        totalTasks: member.jira.total_tasks,
        storyPointsDone: member.jira.done_story_points,
        storyPointsTotal: member.jira.total_story_points,
        commits: member.github.counted_commits,
        role: member.role_in_team,
        contributionPercent,
      };
    });
  }, [rankingData, contributionPercentByMemberId]);

  const chartData = useMemo(() => {
    return memberProgress.map((m) => ({
      name: m.initials,
      progress: m.progress,
      contribution: typeof m.contributionPercent === "number" ? m.contributionPercent : null,
    }));
  }, [memberProgress]);

  if (!mounted) return null;

  if (!isLeader) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">
              Team Progress
            </h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để xem tiến độ đóng góp của từng
              thành viên.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-100">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với vai trò Member. Vui lòng liên hệ Leader nếu cần xem thông tin này.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (isLoading || !resolvedTeamId) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
        <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-200">
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription>
            Không thể tải bảng xếp hạng từ server. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const averageProgress =
    memberProgress.length > 0
      ? memberProgress.reduce((sum, m) => sum + m.progress, 0) / memberProgress.length
      : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-50">
            <Activity className="h-7 w-7 text-[#F27124]" />
            Team Progress
          </h2>
          <p className="text-muted-foreground">
            Biểu đồ tiến độ tổng quan của từng thành viên trong sprint hiện tại.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase">
            Trung bình nhóm
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {averageProgress.toFixed(0)}%
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-5">
        {/* BAR CHART */}
        <Card className="md:col-span-3 shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">
              Tiến độ theo thành viên (% hoàn thành) & % đóng góp (AI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="progress"
                    name="Hoàn thành (%)"
                    radius={[4, 4, 0, 0]}
                    fill="#F27124"
                    barSize={32}
                  />
                  <Bar
                    dataKey="contribution"
                    name="Đóng góp (AI) (%)"
                    radius={[4, 4, 0, 0]}
                    fill="#10B981"
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* MEMBER SUMMARY */}
        <Card className="md:col-span-2 shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">
              Chi tiết tiến độ từng thành viên
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {memberProgress.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-muted/40 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenMembers((prev) => ({ ...prev, [m.id]: !prev[m.id] }))
                  }
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 border bg-background shrink-0">
                      <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-semibold">
                        {m.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{m.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span>
                          Jira task:{" "}
                          <span className="font-medium text-foreground">
                            {m.tasksDone}/{m.totalTasks}
                          </span>
                        </span>
                        <span>
                          SP:{" "}
                          <span className="font-medium text-foreground">
                            {m.storyPointsDone}/{m.storyPointsTotal}
                          </span>
                        </span>
                        <span>
                          Commits:{" "}
                          <span className="font-medium text-foreground">
                            {m.commits}
                          </span>
                        </span>
                        <span>
                          Đóng góp (AI):{" "}
                          <span className="font-medium text-foreground">
                            {typeof m.contributionPercent === "number"
                              ? `${m.contributionPercent.toFixed(0)}%`
                              : "—"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {m.progress}%
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {openMembers[m.id] ? "Thu gọn" : "Xem chi tiết"}
                    </p>
                  </div>
                </button>

                {openMembers[m.id] && (
                  <div className="border-t border-slate-200 dark:border-slate-800 bg-background/40 px-4 py-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-foreground truncate">
                          {m.email || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Student code:
                        </span>
                        <span className="font-medium text-foreground">
                          {m.studentCode || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-medium text-foreground">
                          {m.role || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">GitHub:</span>
                        <span className="font-medium text-foreground">
                          {m.githubUsername || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <span className="text-muted-foreground">Jira ID:</span>
                        <span className="font-medium text-foreground truncate">
                          {m.jiraAccountId || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


