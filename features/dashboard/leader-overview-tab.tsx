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
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
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

// NOTE: Dashboard API hiện chỉ trả số liệu tổng quan (không có time-series),
// nên biểu đồ sẽ hiển thị breakdown theo trạng thái và tổng hợp.

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
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-300 text-sm">
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

  const taskBreakdownData = [
    { name: "To Do", value: taskStats.todo },
    { name: "In Progress", value: Math.max(0, taskStats.inProgress) },
    { name: "Done", value: taskStats.done },
  ];

  const storyPointData = [
    { name: "Done", value: tasks.story_point_done },
    {
      name: "Còn lại",
      value: Math.max(0, tasks.story_point_total - tasks.story_point_done),
    },
  ];

  const commitData = [
    { name: "Counted", value: commits.counted },
    {
      name: "Chưa tính",
      value: Math.max(0, commits.total - commits.counted),
    },
  ];

  const pieTaskColors = ["#94a3b8", "#3b82f6", "#F27124"];
  const pieCommitColors = ["#16a34a", "#64748b"];

  return (
    <div className="space-y-6">
      {/* HEADER: Team Info */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {dashboardData?.team.project_name || "Nhóm"}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            <span>
              {sprints.active > 0
                ? `Đang có ${sprints.active} sprint hoạt động`
                : "Chưa có sprint nào"}
            </span>
            <span className="opacity-70">•</span>
            <span>
              Sprint:{" "}
              <span className="font-semibold text-white">
                {sprints.active}/{sprints.total}
              </span>
            </span>
            <span className="opacity-70">•</span>
            <span>
              Jira:{" "}
              <span className="font-semibold text-white">
                {tasks.done}/{tasks.total}
              </span>{" "}
              task •{" "}
              <span className="font-semibold text-white">
                {tasks.story_point_done}/{tasks.story_point_total}
              </span>{" "}
              SP
            </span>
            <span className="opacity-70">•</span>
            <span>
              GitHub:{" "}
              <span className="font-semibold text-white">
                {commits.counted}/{commits.total}
              </span>{" "}
              counted commits
            </span>
            {commits.last_commit_date && (
              <>
                <span className="opacity-70">•</span>
                <span>
                  Commit gần nhất:{" "}
                  <span className="font-semibold text-white">
                    {new Date(commits.last_commit_date).toLocaleString("vi-VN")}
                  </span>
                </span>
              </>
            )}
            {dashboardData?.team.last_sync_at && (
              <>
                <span className="opacity-70">•</span>
                <span>
                  Đồng bộ lần cuối:{" "}
                  <span className="font-semibold text-white">
                    {new Date(dashboardData.team.last_sync_at).toLocaleString(
                      "vi-VN",
                    )}
                  </span>
                </span>
              </>
            )}
          </div>
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
        {/* TASK BREAKDOWN */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Phân bổ Task theo trạng thái</CardTitle>
            <CardDescription>
              Tổng quan số lượng task To Do / In Progress / Done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskBreakdownData} barGap={12}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
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
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Số task"
                    fill="#F27124"
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* PIE CHARTS */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Tỷ lệ (Pie)</CardTitle>
            <CardDescription>
              Tỷ lệ task theo trạng thái và commits được tính điểm.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-muted/20 p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    Task status
                  </div>
                  <div className="h-[170px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskBreakdownData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {taskBreakdownData.map((_, i) => (
                            <Cell
                              key={`task-cell-${i}`}
                              fill={pieTaskColors[i % pieTaskColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-muted/20 p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    Commits
                  </div>
                  <div className="h-[170px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={commitData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {commitData.map((_, i) => (
                            <Cell
                              key={`commit-cell-${i}`}
                              fill={pieCommitColors[i % pieCommitColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  Task done:{" "}
                  <span className="font-semibold text-foreground">
                    {tasks.done}/{tasks.total}
                  </span>
                </span>
                <span>
                  Commits counted:{" "}
                  <span className="font-semibold text-foreground">
                    {commits.counted}/{commits.total}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STORY POINT + COMMITS */}
        <Card className="col-span-7 shadow-sm">
          <CardHeader>
            <CardTitle>Story points & Commits</CardTitle>
            <CardDescription>
              Tiến độ story points và commits được tính điểm.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Story points ({tasks.story_point_done}/{tasks.story_point_total})
                </div>
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storyPointData} layout="vertical" barCategoryGap={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={70} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar dataKey="value" name="SP" fill="#F27124" radius={[6, 6, 6, 6]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Commits counted ({commits.counted}/{commits.total})
                </div>
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={commitData} layout="vertical" barCategoryGap={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={70} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar dataKey="value" name="Commits" fill="#1e293b" radius={[6, 6, 6, 6]} />
                    </BarChart>
                  </ResponsiveContainer>
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
                    ? "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100"
                    : alert.type === "medium"
                    ? "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/40 dark:border-orange-900/60 dark:text-orange-100"
                    : "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/40 dark:border-yellow-900/60 dark:text-yellow-100"
                }`}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    alert.type === "high"
                      ? "text-red-600 dark:text-red-400"
                      : alert.type === "medium"
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-yellow-600 dark:text-yellow-300"
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
                  className="text-[10px] px-1.5 py-0.5 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
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

