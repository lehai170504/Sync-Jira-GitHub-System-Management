// src/components/features/dashboard/leader-view.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderOverviewTab } from "./leader-overview-tab";
import { LeaderStatisticsTab } from "./leader-statistics-tab";
import { UserCircle } from "lucide-react";

export function LeaderDashboard() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList className="bg-slate-100 dark:bg-slate-900/70 p-1.5 rounded-2xl h-auto inline-flex border border-slate-200/70 dark:border-slate-800/80">
          <TabsTrigger
            value="overview"
            className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="statistics"
            className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm transition-all"
          >
            Thống kê cá nhân
          </TabsTrigger>
        </TabsList>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900"
        >
          <Link href="/profile">
            <UserCircle className="h-4 w-4 mr-2" />
            Hồ sơ cá nhân
          </Link>
        </Button>
      </div>
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
