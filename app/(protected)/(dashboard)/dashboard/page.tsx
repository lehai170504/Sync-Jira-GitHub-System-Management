"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Import Views (Giữ nguyên các component hiển thị của bạn)
import { OverviewTab } from "@/components/features/overview/overview-tab";
import { LecturerDashboard } from "@/components/features/dashboard/lecturer-view";
// import { LeaderDashboard } from "@/components/features/dashboard/student-view"; BE chưa phân quyền nên để sau
import { MemberDashboard } from "@/components/features/dashboard/member-view";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTab } from "@/components/features/analytics/analytics-tab";
import { ReportsTab } from "@/components/features/reports/reports-tab";

// Định nghĩa lại Type cho Role để khớp với file Login
type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

interface UserInfo {
  name: string;
  role: UserRole;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();

  // State quản lý thông tin User và trạng thái loading
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // 2. Lấy thông tin User từ Cookie (đã lưu ở trang Login)
    const savedRole = Cookies.get("user_role") as UserRole;
    const savedName = Cookies.get("user_name");
    const savedEmail = Cookies.get("user_email");

    // 3. Cập nhật State
    if (savedRole) {
      setUser({
        role: savedRole,
        name: savedName || "Người dùng",
        email: savedEmail || "",
      });
    } else {
      // Trường hợp có token nhưng mất cookie info -> Mặc định là STUDENT
      setUser({
        role: "STUDENT",
        name: "Sinh viên",
        email: "",
      });
    }

    setIsLoading(false);
  }, [router]);

  // --- MÀN HÌNH LOADING ---
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Nếu không có user (trường hợp hiếm), return null
  if (!user) return null;

  // --- TRƯỜNG HỢP RIÊNG CHO GIẢNG VIÊN ---
  // Lưu ý: Theo logic Login, Lecturer thường được redirect sang /lecturer/courses
  // Nhưng nếu họ vào /dashboard, ta vẫn hiển thị view phù hợp.
  if (user.role === "LECTURER") {
    return (
      <div className="flex-1 max-w-7xl mx-auto py-6 px-4 md:px-0">
        <LecturerDashboard />
      </div>
    );
  }

  // --- CÁC ROLE CÒN LẠI (ADMIN, LEADER, MEMBER) ---
  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto py-6 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER CHUNG */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {user.role === "ADMIN" && "Tổng quan dự án"}
            {user.role === "STUDENT" && `Xin chào, ${user.name}!`}
          </h2>
          <p className="text-muted-foreground">
            {user.role === "STUDENT"
              ? "Theo dõi tiến độ cá nhân và công việc được giao."
              : "Theo dõi tiến độ, hiệu suất và sức khỏe dự án."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="h-9">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </Button>
          {user.role !== "STUDENT" && (
            <Button className="h-9 bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-sm">
              <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
            </Button>
          )}
        </div>
      </div>

      {/* RENDER VIEW THEO ROLE */}
      {user.role === "ADMIN" && (
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

      {user.role === "STUDENT" && <MemberDashboard />}
    </div>
  );
}
