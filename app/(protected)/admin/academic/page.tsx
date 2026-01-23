"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CalendarRange } from "lucide-react";
import { SemesterTab } from "@/features/management/semesters/components/semester-tab";
import { SubjectTab } from "@/features/management/components/academic/subject-tab";

export default function AcademicPage() {
  const triggerStyle =
    "rounded-full border border-transparent px-6 py-2.5 font-medium text-muted-foreground transition-all hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-[#F27124] data-[state=active]:text-white data-[state=active]:shadow-sm text-base flex items-center gap-2";

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* HEADER SECTION (Giữ nguyên) */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Học vụ
          </h2>
          <p className="text-muted-foreground mt-1">
            Thiết lập thời gian học kỳ và danh mục môn học của hệ thống.
          </p>
        </div>
      </div>

      <Tabs defaultValue="semester" className="w-full">
        {/* CUSTOM TABS NAVIGATION */}
        <div className="mb-8 overflow-x-auto scrollbar-none pb-2">
          {/* Thêm gap-4 để các nút tách rời nhau ra một chút cho thoáng */}
          <TabsList className="bg-transparent p-0 h-auto w-full justify-start space-x-4 min-w-max">
            <TabsTrigger value="semester" className={triggerStyle}>
              <CalendarRange className="h-5 w-5" />
              <span>Cấu hình Học kỳ</span>
            </TabsTrigger>

            <TabsTrigger value="subject" className={triggerStyle}>
              <BookOpen className="h-5 w-5" />
              <span>Danh sách Môn học</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB CONTENTS */}
        <div className="min-h-[400px]">
          <TabsContent
            value="semester"
            className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300 focus-visible:outline-none"
          >
            <SemesterTab />
          </TabsContent>

          <TabsContent
            value="subject"
            className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300 focus-visible:outline-none"
          >
            <SubjectTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
