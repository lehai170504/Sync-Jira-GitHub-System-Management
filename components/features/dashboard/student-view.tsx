// src/components/features/dashboard/leader-view.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderOverviewTab } from "./leader-overview-tab";
import { LeaderStatisticsTab } from "./leader-statistics-tab";

export function LeaderDashboard() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-muted/60 p-1">
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="statistics">Thống kê cá nhân</TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        className="space-y-4 animate-in fade-in-50"
      >
        <LeaderOverviewTab />
      </TabsContent>
      <TabsContent
        value="statistics"
        className="space-y-4 animate-in fade-in-50"
      >
        <LeaderStatisticsTab />
      </TabsContent>
    </Tabs>
  );
}
