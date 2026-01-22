"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar";

// Import Views
import { OverviewTab } from "@/components/features/overview/overview-tab";
import { LecturerDashboard } from "@/components/features/dashboard/lecturer-view";
import { LeaderDashboard } from "@/components/features/dashboard/student-view";
import { MemberDashboard } from "@/components/features/dashboard/member-view";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTab } from "@/components/features/analytics/analytics-tab";
import { ReportsTab } from "@/components/features/reports/reports-tab";

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  // --- TRƯỜNG HỢP RIÊNG CHO GIẢNG VIÊN ---
  // LecturerDashboard đã có Header riêng (Welcome, Avatar, Class Info) nên không cần Header chung nữa
  if (role === "LECTURER") {
    return (
      <div className="flex-1 max-w-7xl mx-auto py-6 px-4 md:px-0">
        <LecturerDashboard />
      </div>
    );
  }

  // --- CÁC ROLE CÒN LẠI (ADMIN, LEADER, MEMBER) ---

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto py-6 px-4 md:px-0">
      {/* HEADER CHUNG */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {role === "ADMIN" && "Tổng quan dự án"}
            {role === "LEADER" && "Quản lý nhóm"}
            {role === "MEMBER" && "Góc học tập của tôi"}
          </h2>
          <p className="text-muted-foreground">
            {role === "MEMBER"
              ? "Theo dõi tiến độ cá nhân và công việc được giao."
              : "Theo dõi tiến độ, hiệu suất và sức khỏe dự án."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="h-9">
            <CalendarIcon className="mr-2 h-4 w-4" /> Tháng 1, 2026
          </Button>
          {role !== "MEMBER" && (
            <Button className="h-9 bg-primary hover:bg-primary/90 text-white shadow-sm">
              <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
            </Button>
          )}
        </div>
      </div>

      {/* RENDER VIEW THEO ROLE */}
      {role === "ADMIN" && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích sâu</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo & Lưu trữ</TabsTrigger>
          </TabsList>
          <TabsContent
            value="overview"
            className="space-y-4 animate-in fade-in-50"
          >
            <OverviewTab />
          </TabsContent>
          <TabsContent
            value="analytics"
            className="space-y-4 animate-in fade-in-50"
          >
            <AnalyticsTab />
          </TabsContent>
          <TabsContent
            value="reports"
            className="space-y-4 animate-in fade-in-50"
          >
            <ReportsTab />
          </TabsContent>
        </Tabs>
      )}

      {role === "LEADER" && <LeaderDashboard />}

      {role === "MEMBER" && <MemberDashboard />}
    </div>
  );
}
