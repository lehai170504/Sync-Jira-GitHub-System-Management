"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";

import { OverviewTab } from "@/components/features/overview/overview-tab";
import { LecturerDashboard } from "@/components/features/dashboard/lecturer-view";
import { MemberDashboard } from "@/components/features/dashboard/member-view";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTab } from "@/components/features/analytics/analytics-tab";
import { ReportsTab } from "@/components/features/reports/reports-tab";

type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

interface UserInfo {
  name: string;
  role: UserRole;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlClassId = searchParams.get("classId");
  const cookieClassId =
    typeof window !== "undefined"
      ? Cookies.get(
          Cookies.get("user_role") === "LECTURER"
            ? "lecturer_class_id"
            : "student_class_id",
        )
      : undefined;

  const activeClassId = urlClassId || cookieClassId;

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const savedRole = Cookies.get("user_role") as UserRole;
    const savedName = Cookies.get("user_name");
    const savedEmail = Cookies.get("user_email");

    if (savedRole) {
      setUser({
        role: savedRole,
        name: savedName || "Người dùng",
        email: savedEmail || "",
      });
    } else {
      setUser({
        role: "STUDENT",
        name: "Sinh viên",
        email: "",
      });
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!user) return null;

  if (user.role === "LECTURER") {
    return (
      <div className="flex-1 max-w-[1600px] mx-auto py-6 px-4 md:px-8">
        <LecturerDashboard classId={activeClassId} />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 max-w-[1600px] mx-auto py-6 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {user.role === "ADMIN" && "Tổng quan Hệ thống"}
            {user.role === "STUDENT" && `Xin chào, ${user.name}!`}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {user.role === "STUDENT"
              ? "Theo dõi tiến độ cá nhân và công việc được giao."
              : "Quản trị viên: Theo dõi hiệu suất và sức khỏe hệ thống."}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 text-slate-600 font-bold w-full md:w-auto"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Button>

          {user.role !== "STUDENT" && (
            <Button className="h-10 bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20 rounded-xl font-bold w-full md:w-auto transition-transform active:scale-95">
              <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
            </Button>
          )}
        </div>
      </div>

      {user.role === "ADMIN" && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-auto inline-flex w-full md:w-auto">
            <TabsTrigger
              value="overview"
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all"
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all"
            >
              Phân tích sâu
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all"
            >
              Báo cáo & Lưu trữ
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[500px]">
            <TabsContent
              value="overview"
              className="space-y-4 animate-in fade-in-50 mt-0"
            >
              <OverviewTab />
            </TabsContent>
            <TabsContent
              value="analytics"
              className="space-y-4 animate-in fade-in-50 mt-0"
            >
              <AnalyticsTab />
            </TabsContent>
            <TabsContent
              value="reports"
              className="space-y-4 animate-in fade-in-50 mt-0"
            >
              <ReportsTab />
            </TabsContent>
          </div>
        </Tabs>
      )}

      {user.role === "STUDENT" && <MemberDashboard classId={activeClassId} />}
    </div>
  );
}
