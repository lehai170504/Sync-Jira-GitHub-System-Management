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
    "rounded-xl border border-transparent px-6 py-2.5 font-bold text-slate-500 dark:text-slate-400 transition-all hover:text-slate-900 dark:hover:text-slate-200 data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md text-sm flex items-center gap-2 active:scale-95";

  return (
    <div className="h-full pb-20 font-sans animate-in fade-in duration-700 relative">
      <div className="max-w-400 mx-auto space-y-8 p-4 md:p-8">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200 dark:border-slate-800 pb-8 transition-colors">
          <div className="space-y-3">
            {/* Badge Title */}
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/30 transition-colors">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Hệ thống quản lý học thuật</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
              Quản lý Học vụ
            </h1>

            {/* Description */}
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-2xl leading-relaxed transition-colors">
              Thiết lập khung thời gian học kỳ, chuẩn hóa danh mục môn học và
              theo dõi tiến độ đào tạo toàn hệ thống.
            </p>
          </div>

          {/* Sub Badge (Version) */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Academic Portal v2.0</span>
          </div>
        </div>

        {/* --- 2. TABS NAVIGATION --- */}
        <Tabs defaultValue="semester" className="w-full space-y-8">
          <div className="flex justify-start">
            <div className="bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm inline-flex transition-colors">
              <TabsList className="bg-transparent p-0 h-auto gap-1">
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
          <div className="relative min-h-125">
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
