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
import { cn } from "@/lib/utils";

export default function AcademicPage() {
  const triggerStyle =
    "rounded-full border border-transparent px-8 py-3 font-black text-muted-foreground transition-all hover:text-gray-900 hover:bg-gray-100/80 data-[state=active]:bg-[#F27124] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 text-sm flex items-center gap-2.5 active:scale-95";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans animate-in fade-in duration-700">
      <div className="max-w-[1440px] mx-auto p-4 md:p-10 space-y-12">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200/60 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#F27124] font-black uppercase tracking-[0.2em] text-[10px] bg-orange-50 w-fit px-3 py-1 rounded-full border border-orange-100">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Hệ thống quản lý học thuật</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-6xl">
              Quản lý Học vụ
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-2xl leading-relaxed">
              Thiết lập khung thời gian học kỳ, chuẩn hóa danh mục môn học và
              theo dõi tiến độ đào tạo toàn hệ thống.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <LayoutDashboard className="h-4 w-4" />
            <span>Academic Portal v2.0</span>
          </div>
        </div>

        <Tabs defaultValue="semester" className="w-full space-y-10">
          {/* --- 2. MODERN TAB NAVIGATION (ISLAND DESIGN) --- */}
          <div className="sticky top-4 z-30 flex justify-center">
            <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/40 inline-flex">
              <TabsList className="bg-transparent p-0 h-auto space-x-2">
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
            {/* Trang trí nền nhẹ */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-white/50 to-transparent -z-10 pointer-events-none" />

            <TabsContent
              value="semester"
              className="mt-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 focus-visible:outline-none"
            >
              <div className="bg-white/40 rounded-[40px] p-2">
                <SemesterTab />
              </div>
            </TabsContent>

            <TabsContent
              value="subject"
              className="mt-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 focus-visible:outline-none"
            >
              <div className="bg-white/40 rounded-[40px] p-2">
                <SubjectTab />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
