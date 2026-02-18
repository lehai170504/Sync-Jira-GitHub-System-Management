// src/features/admin/components/dashboard/dashboard-charts.tsx
"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { chartData } from "./mock-data";

// --- CUSTOM TOOLTIP (Để hỗ trợ Dark Mode tốt hơn) ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <p className="mb-1 text-sm font-bold text-slate-900 dark:text-slate-100">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#F27124]" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {payload[0].value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Main Chart (Chiếm 4 phần) */}
      <Card
        id="revenue-chart"
        className="col-span-4 rounded-[24px] border-slate-100 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors"
      >
        <CardHeader>
          <CardTitle className="text-lg font-black text-slate-900 dark:text-slate-50">
            Lưu lượng truy cập
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Số lượng request và người dùng active trong 7 ngày qua.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27124" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F27124" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8" // Màu trung tính hiển thị tốt trên cả 2 nền
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#64748b" // Slate 500
                  strokeOpacity={0.2}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#F27124"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Side Chart (Chiếm 3 phần) */}
      <Card className="col-span-3 rounded-[24px] border-slate-100 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg font-black text-slate-900 dark:text-slate-50">
            Hoạt động Git/Jira
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Tần suất commit và task update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar dataKey="active" fill="#F27124" radius={[4, 4, 0, 0]} />
                <RechartsTooltip
                  cursor={{ fill: "rgba(242, 113, 36, 0.1)" }}
                  content={<CustomTooltip />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
