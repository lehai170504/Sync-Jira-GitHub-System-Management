"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CalendarRange } from "lucide-react";
import { SemesterTab } from "@/components/features/academic/semester-tab";
import { SubjectTab } from "@/components/features/academic/subject-tab";

export default function AcademicPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        <div className="border-b mb-6">
          <TabsList className="bg-transparent p-0 h-auto space-x-8">
            <TabsTrigger
              value="semester"
              className="rounded-none border-b-[3px] border-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:border-[#F27124] data-[state=active]:text-[#F27124] data-[state=active]:bg-transparent hover:text-gray-900 transition-all text-base"
            >
              <CalendarRange className="mr-2 h-5 w-5" />
              Cấu hình Học kỳ
            </TabsTrigger>
            <TabsTrigger
              value="subject"
              className="rounded-none border-b-[3px] border-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:border-[#F27124] data-[state=active]:text-[#F27124] data-[state=active]:bg-transparent hover:text-gray-900 transition-all text-base"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Danh sách Môn học
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB CONTENTS - ĐƯỢC TÁCH COMPONENT */}
        <TabsContent
          value="semester"
          className="animate-in fade-in-50 duration-500"
        >
          <SemesterTab />
        </TabsContent>

        <TabsContent
          value="subject"
          className="animate-in fade-in-50 duration-500"
        >
          <SubjectTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
