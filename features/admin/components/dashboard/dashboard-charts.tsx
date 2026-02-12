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

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Main Chart (Chiếm 4 phần) */}
      <Card
        id="revenue-chart"
        className="col-span-4 rounded-[24px] border-slate-100 shadow-sm"
      >
        <CardHeader>
          <CardTitle className="text-lg font-black text-slate-900">
            Lưu lượng truy cập
          </CardTitle>
          <CardDescription>
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
                  stroke="#94a3b8"
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
                  stroke="#f1f5f9"
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#1e293b", fontWeight: "bold" }}
                />
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
      <Card className="col-span-3 rounded-[24px] border-slate-100 shadow-sm bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-black text-white">
            Hoạt động Git/Jira
          </CardTitle>
          <CardDescription className="text-slate-400">
            Tần suất commit và task update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar dataKey="active" fill="#F27124" radius={[4, 4, 0, 0]} />
                <RechartsTooltip
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "8px",
                    border: "none",
                    color: "#fff",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
