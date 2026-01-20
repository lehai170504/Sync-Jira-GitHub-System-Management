"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Layers } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data: tỷ lệ đóng góp tổng hợp (Jira + GitHub + Review)
const contributionData = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN", value: 32 },
  { id: "m2", name: "Trần Thị Bình", initials: "BT", value: 28 },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC", value: 22 },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM", value: 18 },
];

const COLORS = ["#F97316", "#0EA5E9", "#22C55E", "#6366F1"];

export default function LeaderContributionPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">
              Contribution Ratio
            </h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để xem tỷ lệ đóng góp của từng thành
              viên.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài
            khoản Leader nếu muốn xem tỷ lệ đóng góp.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const total = contributionData.reduce((sum, m) => sum + m.value, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-7 w-7 text-[#F27124]" />
            Contribution Ratio
          </h2>
          <p className="text-muted-foreground">
            Tỷ lệ đóng góp tổng hợp (Jira Task, Commit GitHub, Peer Review) của
            từng thành viên trong nhóm.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase">
            Tổng đóng góp
          </p>
          <p className="text-2xl font-bold">{total}%</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-5">
        {/* PIE CHART */}
        <Card className="md:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              Biểu đồ tỷ lệ đóng góp (%) theo thành viên
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contributionData}
                  dataKey="value"
                  nameKey="initials"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {contributionData.map((entry, index) => (
                    <Cell
                      key={entry.id}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name, props: any) => {
                    const member = contributionData.find(
                      (m) => m.initials === props?.payload?.name,
                    );
                    return [`${value}%`, member?.name ?? props.name];
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* DETAIL LIST */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              Chi tiết tỷ lệ đóng góp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contributionData.map((m, index) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border bg-background">
                    <AvatarFallback
                      className="text-[10px] font-semibold text-white"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Đóng góp tổng hợp
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{m.value}%</p>
                  <p className="text-[11px] text-muted-foreground">
                    {((m.value / total) * 100).toFixed(1)}% trên tổng nhóm
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


