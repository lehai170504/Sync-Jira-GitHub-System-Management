"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  CalendarRange,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { SemesterTab } from "@/features/management/semesters/components/semester-tab";
import { SubjectTab } from "@/features/management/subjects/components/subject-tab";

export default function AcademicPage() {
  // Cập nhật style cho Tabs Trigger để hỗ trợ Dark Mode
  const triggerStyle =
    "rounded-full border border-transparent px-6 py-2.5 font-bold text-slate-500 dark:text-slate-400 transition-all hover:text-slate-900 dark:hover:text-slate-200 data-[state=active]:bg-[#F27124] data-[state=active]:text-white data-[state=active]:shadow-md text-sm flex items-center gap-2 active:scale-95";

  return (
    <div className="h-full pb-20 font-sans animate-in fade-in duration-700 relative">
      {/* 1. BACKGROUND DECOR (Gradient)
        - Light: Gradient cam/trắng nhẹ.
        - Dark: Ẩn đi (để dùng Dot Grid của Layout) hoặc chuyển sang màu tối mờ để không bị lóa.
      */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/50 via-slate-50/50 to-transparent dark:from-slate-900/50 dark:via-slate-950/50 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200/60 dark:border-slate-800 pb-8 transition-colors">
          <div className="space-y-3">
            {/* Badge Title */}
            <div className="flex items-center gap-2 text-[#F27124] dark:text-orange-400 font-black uppercase tracking-[0.2em] text-[10px] bg-orange-50 dark:bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-100 dark:border-orange-500/20 transition-colors">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Hệ thống quản lý học thuật</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-50 md:text-5xl lg:text-6xl transition-colors">
              Quản lý Học vụ
            </h1>

            {/* Description */}
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-2xl leading-relaxed transition-colors">
              Thiết lập khung thời gian học kỳ, chuẩn hóa danh mục môn học và
              theo dõi tiến độ đào tạo toàn hệ thống.
            </p>
          </div>

          {/* Sub Badge (Version) */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            <span>Academic Portal v2.0</span>
          </div>
        </div>

        {/* --- 2. TABS NAVIGATION --- */}
        <Tabs defaultValue="semester" className="w-full space-y-8">
          <div className="flex justify-center">
            {/* Tabs Wrapper: Glassmorphism cho cả Light và Dark */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-1.5 rounded-full border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 inline-flex ring-1 ring-slate-900/5 dark:ring-white/10 transition-all">
              <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-0 h-auto rounded-full gap-1 transition-colors">
                <TabsTrigger value="semester" className={triggerStyle}>
                  <CalendarRange className="h-4 w-4" />
                  <span>Cấu hình Học kỳ</span>
                </TabsTrigger>

                <TabsTrigger value="subject" className={triggerStyle}>
                  <BookOpen className="h-4 w-4" />
                  <span>Danh mục Môn học</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* --- 3. TAB CONTENTS --- */}
          <div className="relative min-h-[500px]">
            <TabsContent
              value="semester"
              className="mt-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
            >
              <SemesterTab />
            </TabsContent>

            <TabsContent
              value="subject"
              className="mt-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
            >
              <SubjectTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
