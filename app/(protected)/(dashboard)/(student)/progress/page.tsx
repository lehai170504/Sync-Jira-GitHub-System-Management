"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, Loader2 } from "lucide-react";
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
import { useSocket } from "@/components/providers/socket-provider";

// Helper function để lấy initials từ tên
const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Backend trả về git_score / jira_score theo tỷ lệ 0..1.
// UI cần hiển thị % (nhân 100).
const ratioToPercent = (value: unknown): number => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n >= 0 && n <= 1) return n * 100;
  return Math.min(100, Math.max(0, n));
};

export default function LeaderProgressPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeader, setIsLeader] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openMembers, setOpenMembers] = useState<Record<string, boolean>>({});

  const { isConnected, socket } = useSocket();

  // Resolve teamId giống trang /tasks và /config
  const classId = Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  const {
    data: teamsData,
    isPending: isTeamsPending,
    isFetched: isTeamsFetched,
  } = useClassTeams(classId || undefined);
  const myTeamInfo = teamsData?.teams?.find((t: any) => t.project_name === myTeamName);
  const resolvedTeamId = myTeamInfo?._id || teamsData?.teams?.[0]?._id;

  // Đảm bảo Socket.io đã join đúng room team cho trang /progress,
  // để nhận event `LEADERBOARD_UPDATED` (không cần F5/polling).
  useEffect(() => {
    if (!isConnected || !resolvedTeamId) return;
    socket.emit("join_team", resolvedTeamId);
    socket.emit("joinTeam", resolvedTeamId);
    Cookies.set("student_team_id", resolvedTeamId);
  }, [isConnected, resolvedTeamId, socket]);

  // GET /api/teams/:teamId/ranking — tiến độ & điểm thành viên
  const {
    data: rankingData,
    isPending: isRankingPending,
    error: rankingError,
  } = useTeamRanking(resolvedTeamId);
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

  const teamSummary = rankingData?.summary;

  // Map GET /api/teams/:teamId/ranking → UI
  const memberProgress = useMemo(() => {
    if (!rankingData?.ranking) return [];

    return rankingData.ranking.map((member) => {
      const jira = member.jira ?? {
        done_tasks: 0,
        done_story_points: 0,
        total_tasks: 0,
        total_story_points: 0,
      };
      const github = member.github ?? { counted_commits: 0 };

      const studentName =
        member.student?.full_name || `Member ${member.member_id.slice(-4)}`;
      const initials = getInitials(studentName);
      const totalTasks = jira.total_tasks;
      const progress =
        totalTasks > 0
          ? Math.round((jira.done_tasks / totalTasks) * 100)
          : 0;

      const contributionPercent =
        contributionPercentByMemberId && contributionPercentByMemberId.ok
          ? contributionPercentByMemberId.map.get(member.member_id)
          : undefined;

      const personalValid =
        github.personal_valid_commits ?? github.counted_commits;
      const teamValidCommits =
        github.total_team_valid_commits ?? teamSummary?.total_team_valid_commits;

      return {
        id: member.member_id,
        name: studentName,
        initials,
        avatarUrl: member.student?.avatar_url,
        email: member.student?.email || "",
        studentCode: member.student?.student_code || "",
        jiraAccountId: member.mapping?.jira_account_id || "",
        githubUsername: member.mapping?.github_username || "",
        progress,
        tasksDone: jira.done_tasks,
        totalTasks,
        storyPointsDone: jira.done_story_points,
        storyPointsTotal: jira.total_story_points,
        commits: github.counted_commits,
        personalValidCommits: personalValid,
        teamValidCommits,
        role: member.role_in_team,
        contributionPercent,
        gitScorePercent: ratioToPercent(github.git_score ?? member.git_score),
        jiraScorePercent: ratioToPercent(jira.jira_score ?? member.jira_score),
      };
    });
  }, [rankingData, contributionPercentByMemberId, teamSummary]);

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

  if (classId && isTeamsPending) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
        <Alert className="bg-amber-50 border-amber-200 text-amber-950 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-100">
          <AlertTitle>Chưa xác định lớp</AlertTitle>
          <AlertDescription>
            Không tìm thấy lớp trong phiên đăng nhập. Vào lại Dashboard hoặc chọn
            lớp để tải nhóm và bảng xếp hạng.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isTeamsFetched && !resolvedTeamId) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
        <Alert className="bg-gray-50 border-gray-200 text-gray-900 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-100">
          <AlertTitle>Chưa có nhóm</AlertTitle>
          <AlertDescription>
            Không tìm thấy nhóm trong lớp này. Kiểm tra cookie nhóm hoặc liên hệ
            giảng viên.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (resolvedTeamId && isRankingPending) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (rankingError) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
        <Alert className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-200">
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription>
            Không thể tải GET /teams/…/ranking. Vui lòng thử lại sau.
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

      {teamSummary ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardContent className="pt-4 pb-3">
              <p className="text-[11px] text-muted-foreground uppercase">
                Thành viên (API)
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {rankingData?.total ?? memberProgress.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardContent className="pt-4 pb-3">
              <p className="text-[11px] text-muted-foreground uppercase">
                Commit hợp lệ (nhóm)
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {teamSummary.total_team_valid_commits}
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm sm:col-span-2">
            <CardContent className="pt-4 pb-3">
              <p className="text-[11px] text-muted-foreground uppercase">
                Story points hoàn thành (nhóm)
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {teamSummary.total_team_done_story_points}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Separator />

      <div className="grid gap-6 md:grid-cols-5">
        {/* BAR CHART */}
        <Card className="md:col-span-3 shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">
              Tiến độ Jira (% task done) & % đóng góp
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
            {memberProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Ranking trống — chưa có thành viên hoặc chưa đồng bộ dữ liệu.
              </p>
            ) : null}
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
                      {m.avatarUrl ? (
                        <AvatarImage src={m.avatarUrl} alt="" />
                      ) : null}
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
                          Commits (đếm):{" "}
                          <span className="font-medium text-foreground">
                            {m.commits}
                          </span>
                        </span>
                        <span>
                          Đóng góp:{" "}
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
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Git score (%):
                        </span>
                        <span className="font-medium text-foreground">
                          {m.gitScorePercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Jira score (%):
                        </span>
                        <span className="font-medium text-foreground">
                          {m.jiraScorePercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Commit hợp lệ (cá nhân):
                        </span>
                        <span className="font-medium text-foreground">
                          {m.personalValidCommits}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <span className="text-muted-foreground">
                          Commit hợp lệ (cả nhóm):
                        </span>
                        <span className="font-medium text-foreground">
                          {typeof m.teamValidCommits === "number"
                            ? m.teamValidCommits
                            : "—"}
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


