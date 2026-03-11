"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  BookOpen,
  Layout,
  Settings,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import { AppearanceSettings } from "@/features/settings/appearance-card";
import { NotificationSettings } from "@/features/settings/notification-card";
import { GradingConfig } from "@/features/lecturer/components/settings/grading-config";

// Import hook để lấy thông tin lớp
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("classId") ?? undefined;
  const [classId, setClassId] = useState<string | undefined>(
    urlClassId ?? undefined
  );

  useEffect(() => {
    if (urlClassId) {
      setClassId(urlClassId);
      return;
    }

    const cookieClassId =
      Cookies.get("lecturer_class_id") ||
      Cookies.get("student_class_id") ||
      undefined;

    setClassId((prev) => prev ?? cookieClassId);
  }, [urlClassId]);

  const { data: classDetailData, isLoading } = useClassDetails(classId);
  const classInfo = classDetailData?.class;

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4 text-slate-400 dark:text-slate-500">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-xl shadow-orange-100 dark:shadow-none border border-orange-50 dark:border-slate-800">
          <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
        </div>
        <p className="text-sm font-medium animate-pulse">
          Đang tải dữ liệu cấu hình...
        </p>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!classId || !classInfo) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-500 dark:text-slate-400 animate-in fade-in duration-500">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full mb-6 border border-slate-100 dark:border-slate-800">
          <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
          Chưa xác định lớp học
        </h2>
        <p className="font-medium text-sm text-slate-400 dark:text-slate-500">
          Vui lòng chọn lớp học từ danh sách để xem cấu hình.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl space-y-8 animate-in fade-in-50 font-sans pb-20 transition-colors duration-300">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F27124] dark:text-orange-400 mb-2">
            <Settings className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Settings & Configurations
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-50">
            Cài đặt & Cấu hình
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium flex items-center flex-wrap gap-2">
            Quản lý tham số vận hành cho lớp
            <span className="font-bold text-[#F27124] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-md border border-orange-100 dark:border-orange-800 tracking-wider">
              {classInfo.name}
            </span>
          </p>
        </div>
      </div>

      <Separator className="bg-slate-200 dark:bg-slate-800" />

      {/* 2. MAIN TABS */}
      <Tabs defaultValue="class-config" className="space-y-8">
        <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 inline-flex h-auto w-full md:w-auto gap-1">
          <TabsTrigger
            value="class-config"
            className="gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#F27124] dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-md data-[state=active]:font-bold text-slate-500 dark:text-slate-400 font-medium transition-all"
          >
            <BookOpen className="h-4 w-4" /> Cấu hình Điểm số (Scoring)
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-md data-[state=active]:font-bold text-slate-500 dark:text-slate-400 font-medium transition-all"
          >
            <Layout className="h-4 w-4" /> Giao diện & Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: CLASS CONFIGURATION --- */}
        <TabsContent value="class-config" className="outline-none">
          {classId ? (
            <GradingConfig classId={classId} />
          ) : (
            <div className="text-center p-4 text-slate-500">
              Đang tải Class ID...
            </div>
          )}
        </TabsContent>

        {/* --- TAB 2: SYSTEM SETTINGS --- */}
        <TabsContent
          value="system"
          className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Tùy chỉnh trải nghiệm cá nhân
            </h3>
          </div>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <AppearanceSettings />
            <NotificationSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
