"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  // Resolve teamId giống trang /tasks và /config
  const classId = Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  const { data: teamsData } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find((t: any) => t.project_name === myTeamName);
  const resolvedTeamId = myTeamInfo?._id || teamsData?.teams?.[0]?._id;

  // Fetch ranking data từ API
  const { data: rankingData, isLoading, error } = useTeamRanking(resolvedTeamId);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeader(leaderStatus);
    setMounted(true);
  }, []);

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
      
      return {
        id: member.member_id,
        name: studentName,
        initials,
        progress,
        tasksDone: member.jira.done_tasks,
        totalTasks: member.jira.total_tasks,
        storyPointsDone: member.jira.done_story_points,
        storyPointsTotal: member.jira.total_story_points,
        commits: member.github.counted_commits,
        role: member.role_in_team,
      };
    });
  }, [rankingData]);

  const chartData = useMemo(() => {
    return memberProgress.map((m) => ({
      name: m.initials,
      progress: m.progress,
    }));
  }, [memberProgress]);

  if (!mounted) return null;

  if (!isLeader) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
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
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
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
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <Alert className="bg-red-50 border-red-200 text-red-900">
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
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
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
          <p className="text-2xl font-bold text-emerald-600">
            {averageProgress.toFixed(0)}%
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-5">
        {/* BAR CHART */}
        <Card className="md:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              Tiến độ theo thành viên (% hoàn thành)
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
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              Chi tiết tiến độ từng thành viên
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {memberProgress.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border bg-background">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.tasksDone}/{m.totalTasks} task hoàn thành
                      {m.commits > 0 && ` • ${m.commits} commits`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    {m.progress}%
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    So với mục tiêu 100%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


