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
  const triggerStyle =
    "rounded-full border border-transparent px-6 py-2.5 font-bold text-slate-500 transition-all hover:text-slate-900 data-[state=active]:bg-[#F27124] data-[state=active]:text-white data-[state=active]:shadow-md text-sm flex items-center gap-2 active:scale-95";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans animate-in fade-in duration-700 relative">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/50 via-slate-50/50 to-white pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 space-y-8">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200/60 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#F27124] font-black uppercase tracking-[0.2em] text-[10px] bg-orange-50 w-fit px-3 py-1 rounded-full border border-orange-100">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Hệ thống quản lý học thuật</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl lg:text-6xl">
              Quản lý Học vụ
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
              Thiết lập khung thời gian học kỳ, chuẩn hóa danh mục môn học và
              theo dõi tiến độ đào tạo toàn hệ thống.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            <LayoutDashboard className="h-4 w-4" />
            <span>Academic Portal v2.0</span>
          </div>
        </div>

        <Tabs defaultValue="semester" className="w-full space-y-8">
          {/* --- 2. NAVIGATION (ĐÃ SỬA: KHÔNG CÒN STICKY) --- */}
          {/* Đã xóa class 'sticky top-6 z-50 pointer-events-none' */}
          {/* Giờ nó là một div bình thường, sẽ cuộn theo nội dung */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-2xl p-1.5 rounded-full border border-white/20 shadow-xl shadow-slate-200/50 inline-flex ring-1 ring-slate-900/5">
              <TabsList className="bg-slate-100/50 p-0 h-auto rounded-full gap-1">
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
          <div className="relative min-h-[600px]">
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
