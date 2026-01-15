"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";
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
import { StatCard } from "./stat-card";

// Mock Data
const chartData = [
  { name: "T2", task: 12, commit: 45 },
  { name: "T3", task: 18, commit: 52 },
  { name: "T4", task: 5, commit: 28 },
  { name: "T5", task: 22, commit: 70 },
  { name: "T6", task: 15, commit: 48 },
  { name: "T7", task: 8, commit: 30 },
  { name: "CN", task: 2, commit: 10 },
];

const activities = [
  {
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://github.com/shadcn.png",
      fallback: "NA",
    },
    action: "đã commit code",
    target: "feat: update login UI",
    project: "Front-end",
    time: "2 phút trước",
    type: "commit",
  },
  {
    user: { name: "Trần Thị B", avatar: "", fallback: "TB" },
    action: "hoàn thành task",
    target: "DB Schema v2",
    project: "Back-end",
    time: "1 giờ trước",
    type: "task",
  },
  {
    user: { name: "Lê Hoàng C", avatar: "", fallback: "LC" },
    action: "gặp vấn đề",
    target: "API Timeout",
    project: "System",
    time: "3 giờ trước",
    type: "alert",
  },
];

export function OverviewTab() {
  return (
    <div className="space-y-4">
      {/* STATS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Nhiệm vụ hoàn thành"
          value="128"
          subtext="+12% tuần này"
          icon={CheckCircle2}
          trend="up"
        />
        <StatCard
          title="Tổng Commits"
          value="2,350"
          subtext="+24% tuần này"
          icon={GitCommit}
          trend="up"
        />
        <StatCard
          title="Cảnh báo rủi ro"
          value="3"
          subtext="+1 vấn đề mới"
          icon={AlertTriangle}
          trend="down"
        />
        <StatCard
          title="Tiến độ Sprint"
          value="65%"
          subtext="Còn 4 ngày"
          icon={Activity}
          trend="neutral"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* CHART */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Biểu đồ đóng góp</CardTitle>
            <CardDescription>
              Tương quan giữa Task và Commit trong tuần.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
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
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    dataKey="task"
                    name="Jira Tasks"
                    fill="#F27124"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                  <Bar
                    dataKey="commit"
                    name="GitHub Commits"
                    fill="#1e293b"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVITY */}
        <Card className="col-span-3 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Nhật ký hệ thống real-time.</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-2">
            <div className="space-y-8">
              {activities.map((item, i) => (
                <div className="flex items-start gap-4" key={i}>
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={item.user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {item.user.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="text-foreground">{item.user.name}</span>{" "}
                      <span className="text-muted-foreground font-normal">
                        {item.action}
                      </span>
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {item.target}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 px-1.5 font-normal"
                      >
                        {item.project}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-1.5 rounded-full mt-1 shrink-0 ${
                      item.type === "commit"
                        ? "bg-blue-100 text-blue-600"
                        : item.type === "task"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.type === "commit" ? (
                      <GitCommit className="h-3 w-3" />
                    ) : item.type === "task" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
