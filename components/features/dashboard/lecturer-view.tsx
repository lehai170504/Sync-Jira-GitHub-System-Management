// src/components/features/dashboard/lecturer-view.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const groupProgressData = [
  { group: "Team 1", progress: 85, risk: 0 },
  { group: "Team 2", progress: 60, risk: 1 },
  { group: "Team 3", progress: 92, risk: 0 },
  { group: "Team 4", progress: 45, risk: 2 }, // Nhóm yếu
];

export function LecturerDashboard() {
  return (
    <div className="space-y-6">
      {/* STATS ROW */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lớp đang dạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" /> 4 Lớp
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              SE1740, SE1741, SE1742, AI1801
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sinh viên cần chú ý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" /> 7 Sinh viên
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Có dấu hiệu trễ deadline / thiếu commit
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tiến độ chung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" /> 68%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sprint 3/5 đang diễn ra
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* CHART: So sánh các nhóm */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tiến độ các nhóm (Lớp SE1740)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupProgressData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    dataKey="group"
                    type="category"
                    width={60}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="progress"
                    fill="#F27124"
                    radius={[0, 4, 4, 0]}
                    barSize={32}
                    name="Hoàn thành (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* LIST: Cảnh báo rủi ro */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Cảnh báo rủi ro</CardTitle>
            <CardDescription>
              Sinh viên thiếu hoạt động 3 ngày qua
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                    NV
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nguyễn Văn {i}</p>
                    <p className="text-xs text-muted-foreground">
                      Team {i} - SE1740
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-200 bg-red-50"
                >
                  High Risk
                </Badge>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full text-xs text-muted-foreground"
            >
              Xem tất cả <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
