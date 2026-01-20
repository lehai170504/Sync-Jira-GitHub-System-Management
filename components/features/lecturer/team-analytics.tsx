"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AlertTriangle, CheckCircle2, GitCommit, Bug } from "lucide-react";

// Mock Data cho biểu đồ
const BURNDOWN_DATA = [
  { day: "Day 1", ideal: 40, actual: 40 },
  { day: "Day 2", ideal: 35, actual: 38 },
  { day: "Day 3", ideal: 30, actual: 32 },
  { day: "Day 4", ideal: 25, actual: 20 }, // Làm nhanh hơn dự kiến
  { day: "Day 5", ideal: 20, actual: 18 },
  { day: "Day 6", ideal: 15, actual: 15 },
  { day: "Day 7", ideal: 10, actual: 8 },
];

const COMMIT_DATA = [
  { date: "Mon", commits: 5 },
  { date: "Tue", commits: 12 },
  { date: "Wed", commits: 8 },
  { date: "Thu", commits: 20 }, // Peak
  { date: "Fri", commits: 15 },
  { date: "Sat", commits: 2 },
  { date: "Sun", commits: 0 },
];

export function TeamAnalytics() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sprint Progress
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">Tasks completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +24 so với tuần trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bugs</CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">1 Critical</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Low</div>
            <p className="text-xs text-muted-foreground">Tiến độ ổn định</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jira Burndown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Burndown (Jira)</CardTitle>
            <CardDescription>
              So sánh tiến độ thực tế vs lý thuyết
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BURNDOWN_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  stroke="#8884d8"
                  strokeDasharray="5 5"
                  name="Lý thuyết"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#F27124"
                  strokeWidth={2}
                  name="Thực tế"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GitHub Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Code Activity (GitHub)</CardTitle>
            <CardDescription>Tần suất commit trong tuần qua</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMMIT_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="commits"
                  fill="#0f172a"
                  radius={[4, 4, 0, 0]}
                  name="Số Commit"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
