"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Download } from "lucide-react";

// Import các components đã tách
import { OverviewTab } from "@/components/features/dashboard/overview-tab";
import { AnalyticsTab } from "@/components/features/dashboard/analytics-tab";
import { ReportsTab } from "@/components/features/dashboard/reports-tab";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto py-6 px-4 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Tổng quan dự án
          </h2>
          <p className="text-muted-foreground">
            Theo dõi tiến độ, hiệu suất và sức khỏe của dự án theo thời gian
            thực.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="h-9">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Tháng 1, 2026
          </Button>
          <Button className="h-9 bg-primary hover:bg-primary/90 text-white shadow-sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất Dashboard
          </Button>
        </div>
      </div>

      {/* TABS SECTION */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích sâu</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo & Lưu trữ</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent
          value="overview"
          className="space-y-4 animate-in fade-in-50"
        >
          <OverviewTab />
        </TabsContent>

        {/* TAB 2: ANALYTICS (MỚI) */}
        <TabsContent
          value="analytics"
          className="space-y-4 animate-in fade-in-50"
        >
          <AnalyticsTab />
        </TabsContent>

        {/* TAB 3: REPORTS (MỚI) */}
        <TabsContent
          value="reports"
          className="space-y-4 animate-in fade-in-50"
        >
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
