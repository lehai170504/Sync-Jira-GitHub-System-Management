// src/components/features/dashboard/member-view.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberOverviewTab } from "./member-overview-tab";
import { MyStatisticsTab } from "./my-statistics-tab";

// 1. Định nghĩa Props
interface MemberDashboardProps {
  classId?: string;
}

export function MemberDashboard({ classId }: MemberDashboardProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-auto inline-flex">
        <TabsTrigger
          value="overview"
          className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all"
        >
          Tổng quan
        </TabsTrigger>
        <TabsTrigger
          value="statistics"
          className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all"
        >
          Thống kê cá nhân
        </TabsTrigger>
      </TabsList>

      <div className="min-h-[500px]">
        <TabsContent
          value="overview"
          className="space-y-4 animate-in fade-in-50 mt-4"
        >
          {/* 2. Truyền classId xuống component con */}
          <MemberOverviewTab classId={classId} />
        </TabsContent>
        <TabsContent
          value="statistics"
          className="space-y-4 animate-in fade-in-50 mt-4"
        >
          {/* 2. Truyền classId xuống component con */}
          <MyStatisticsTab classId={classId} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
