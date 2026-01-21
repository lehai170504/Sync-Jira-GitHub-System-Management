"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity } from "lucide-react";
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

// Mock data: tiến độ từng thành viên (0–100%)
const memberProgress = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN", progress: 85, tasksDone: 8 },
  { id: "m2", name: "Trần Thị Bình", initials: "BT", progress: 72, tasksDone: 6 },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC", progress: 64, tasksDone: 5 },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM", progress: 48, tasksDone: 3 },
];

const chartData = memberProgress.map((m) => ({
  name: m.initials,
  progress: m.progress,
}));

export default function LeaderProgressPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  if (role !== "MEMBER") {
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
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài
            khoản Leader nếu muốn xem tiến độ nhóm.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const averageProgress =
    memberProgress.reduce((sum, m) => sum + m.progress, 0) /
    memberProgress.length;

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
                      {m.tasksDone} task hoàn thành
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


