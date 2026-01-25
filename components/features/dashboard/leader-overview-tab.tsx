// src/components/features/dashboard/leader-overview-tab.tsx
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CheckCircle2,
  Clock,
  Circle,
  GitCommit,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { useTeamDashboard } from "@/features/management/teams/hooks/use-team-dashboard";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";

// Mock data: Burndown Chart (Tiến độ Sprint)
const burnDownData = [
  { day: "Day 1", planned: 100, actual: 100 },
  { day: "Day 2", planned: 90, actual: 95 },
  { day: "Day 3", planned: 80, actual: 85 },
  { day: "Day 4", planned: 70, actual: 75 },
  { day: "Day 5", planned: 60, actual: 65 },
  { day: "Day 6", planned: 50, actual: 55 },
  { day: "Day 7", planned: 40, actual: 50 }, // Chậm hơn kế hoạch
  { day: "Day 8", planned: 30, actual: 45 },
  { day: "Day 9", planned: 20, actual: 35 },
  { day: "Day 10", planned: 10, actual: 25 },
  { day: "Day 11", planned: 0, actual: 15 },
];

// Mock data: Commit của nhóm theo ngày
const commitData = [
  { date: "T2", commits: 12 },
  { date: "T3", commits: 18 },
  { date: "T4", commits: 15 },
  { date: "T5", commits: 22 },
  { date: "T6", commits: 19 },
  { date: "T7", commits: 8 },
  { date: "CN", commits: 3 },
];

// Mock data: Cảnh báo rủi ro
const riskAlerts = [
  {
    id: 1,
    type: "high",
    title: "Task trễ deadline",
    description: "Task 'API Authentication' đã quá hạn 2 ngày. Cần ưu tiên xử lý.",
    assignee: "An Nguyễn",
  },
  {
    id: 2,
    type: "medium",
    title: "Thiếu commit trong 3 ngày",
    description: "Thành viên 'Bình Trần' chưa có commit từ 15/01. Kiểm tra tiến độ.",
    assignee: "Bình Trần",
  },
  {
    id: 3,
    type: "low",
    title: "PR chưa được review",
    description: "Pull Request #42 đã mở 4 ngày. Cần review sớm để merge.",
    assignee: "Cường Lê",
  },
];

// Mock data: Task của Leader (Task Summary)
const myTasks = [
  {
    id: "L-201",
    title: "Review kiến trúc Sprint 4",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    due: "Hôm nay",
  },
  {
    id: "L-202",
    title: "Approve kế hoạch Sprint 5",
    status: "To Do",
    statusColor: "bg-gray-100 text-gray-700",
    due: "Ngày mai",
  },
  {
    id: "L-203",
    title: "Họp 1-1 với các thành viên",
    status: "Scheduled",
    statusColor: "bg-amber-100 text-amber-700",
    due: "Cuối tuần",
  },
  {
    id: "L-204",
    title: "Rà soát kết quả Contribution",
    status: "Done",
    statusColor: "bg-emerald-100 text-emerald-700",
    due: "Hôm qua",
  },
];

export function LeaderOverviewTab() {
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const { data: myClasses } = useMyClasses();
  const { data: dashboardData, isLoading, error } = useTeamDashboard(teamId);

  // Lấy teamId từ class hiện tại hoặc từ myClasses
  useEffect(() => {
    const classId = Cookies.get("student_class_id");
    if (classId && myClasses?.classes) {
      const currentClass = myClasses.classes.find(
        (cls) => cls.class._id === classId
      );
      if (currentClass?.team_id) {
        setTeamId(currentClass.team_id);
      }
    } else if (myClasses?.classes && myClasses.classes.length > 0) {
      // Nếu không có classId trong cookie, lấy class đầu tiên
      setTeamId(myClasses.classes[0].team_id);
    }
  }, [myClasses]);

  // Loading state
  if (isLoading || !teamId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">
              Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Lấy dữ liệu từ API
  const tasks = dashboardData?.overview.tasks || {
    total: 0,
    done: 0,
    todo: 0,
    done_percent: 0,
    story_point_total: 0,
    story_point_done: 0,
  };

  const commits = dashboardData?.overview.commits || {
    total: 0,
    counted: 0,
    last_commit_date: null,
  };

  const sprints = dashboardData?.overview.sprints || {
    total: 0,
    active: 0,
  };

  // Tính phần trăm hoàn thành
  const completionRate = tasks.total > 0 
    ? Math.round((tasks.done / tasks.total) * 100)
    : 0;

  // Task stats từ API
  const taskStats = {
    todo: tasks.todo,
    inProgress: tasks.total - tasks.done - tasks.todo, // Tính toán từ total - done - todo
    done: tasks.done,
    total: tasks.total,
  };

  return (
    <div className="space-y-6">
      {/* HEADER: Team Info */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {dashboardData?.team.project_name || "Nhóm"}
          </h2>
          <p className="text-slate-300 mt-1">
            {sprints.active > 0
              ? `Đang có ${sprints.active} sprint hoạt động`
              : "Chưa có sprint nào"}
            {dashboardData?.team.last_sync_at && (
              <span className="ml-2 text-xs">
                • Đồng bộ: {new Date(dashboardData.team.last_sync_at).toLocaleString("vi-VN")}
              </span>
            )}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#F27124]">
            {completionRate}%
          </div>
          <div className="text-xs text-slate-400">Hoàn thành Task</div>
        </div>
      </div>

      {/* KPI CARDS: Tổng số Task (To Do / In Progress / Done) */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="To Do"
          value={taskStats.todo}
          subtext={`${taskStats.total} tasks tổng cộng`}
          icon={Circle}
          trend="neutral"
        />
        <StatCard
          title="In Progress"
          value={taskStats.inProgress}
          subtext="Đang thực hiện"
          icon={Clock}
          trend="neutral"
        />
        <StatCard
          title="Done"
          value={taskStats.done}
          subtext={`${completionRate}% hoàn thành`}
          icon={CheckCircle2}
          trend="up"
        />
      </div>

      {/* MAIN GRID: Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* BURNDOWN CHART: Tiến độ Sprint */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Biểu đồ Burndown (Tiến độ Sprint)</CardTitle>
            <CardDescription>
              So sánh khối lượng công việc dự kiến và thực tế theo thời gian.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnDownData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
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
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    name="Kế hoạch"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Thực tế"
                    stroke="#F27124"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* COMMIT CHART: Tổng số commit của nhóm */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Tổng số Commit của nhóm</CardTitle>
            <CardDescription>
              Hoạt động commit theo ngày trong tuần.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commitData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
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
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    name="Số Commit"
                    stroke="#1e293b"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F27124]">
                  {commits.total}
                </div>
                <div className="text-xs text-muted-foreground">
                  Tổng số commits
                </div>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {commits.counted}
                </div>
                <div className="text-xs text-muted-foreground">
                  Đã được tính điểm
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RISK ALERTS + TASK SUMMARY */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* RISK ALERTS: Cảnh báo rủi ro */}
        <Card className="md:col-span-3 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Cảnh báo rủi ro
                </CardTitle>
                <CardDescription>
                  Các vấn đề cần chú ý và xử lý ngay.
                </CardDescription>
              </div>
              <Badge
                variant="destructive"
                className="text-sm px-3 py-1 font-semibold"
              >
                {riskAlerts.length} Cảnh báo
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskAlerts.map((alert) => (
              <Alert
                key={alert.id}
                className={`${
                  alert.type === "high"
                    ? "bg-red-50 border-red-200 text-red-900"
                    : alert.type === "medium"
                    ? "bg-orange-50 border-orange-200 text-orange-900"
                    : "bg-yellow-50 border-yellow-200 text-yellow-900"
                }`}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    alert.type === "high"
                      ? "text-red-600"
                      : alert.type === "medium"
                      ? "text-orange-600"
                      : "text-yellow-600"
                  }`}
                />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.title}</span>
                  <Badge
                    variant={
                      alert.type === "high"
                        ? "destructive"
                        : alert.type === "medium"
                        ? "default"
                        : "secondary"
                    }
                    className="ml-2 text-xs"
                  >
                    {alert.type === "high"
                      ? "Cao"
                      : alert.type === "medium"
                      ? "Trung bình"
                      : "Thấp"}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-sm">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Người phụ trách:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {alert.assignee}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>

        {/* TASK SUMMARY: Task của tôi */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Task của tôi</CardTitle>
            <CardDescription>
              Các đầu việc Leader cần xử lý, kèm trạng thái nhanh.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Mã: <span className="font-mono">{task.id}</span> • Hạn:{" "}
                    <span className="font-medium">{task.due}</span>
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-[11px] font-normal ${task.statusColor}`}
                >
                  {task.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* COMMIT SUMMARY: Commit gần nhất */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCommit className="h-5 w-5 text-slate-800" />
            Commit gần nhất của nhóm
          </CardTitle>
          <CardDescription>
            Danh sách một số commit mới nhất, giúp Leader nắm nhanh hoạt động code của team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            {
              id: "c1",
              message: "Implement payment webhook handler",
              author: "Nguyễn Văn An",
              time: "10 phút trước",
              branch: "feature/payment-webhook",
            },
            {
              id: "c2",
              message: "Refactor Auth middleware & fix bug token refresh",
              author: "Trần Thị Bình",
              time: "35 phút trước",
              branch: "feature/auth-refactor",
            },
            {
              id: "c3",
              message: "Add unit test cho CartService",
              author: "Lê Hoàng Cường",
              time: "1 giờ trước",
              branch: "test/cart-service",
            },
            {
              id: "c4",
              message: "Update README hướng dẫn deploy",
              author: "Phạm Minh Dung",
              time: "2 giờ trước",
              branch: "chore/docs-deploy",
            },
          ].map((commit) => (
            <div
              key={commit.id}
              className="flex items-start justify-between rounded-lg border bg-muted/40 px-3 py-2"
            >
              <div className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-slate-900 text-white h-6 w-6 flex items-center justify-center">
                  <GitCommit className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-semibold line-clamp-1">
                    {commit.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    By <span className="font-medium">{commit.author}</span> •{" "}
                    <span className="font-mono">{commit.branch}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{commit.time}</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0.5 border-slate-300 text-slate-700"
                >
                  MỚI
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

