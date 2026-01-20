"use client";

import { OverviewStats } from "@/components/features/overview/overview-stats";
import { ContributionChart } from "@/components/features/overview/contribution-chart";
import { RecentActivity } from "@/components/features/overview/recent-activity";

export function OverviewTab() {
  return (
    <div className="space-y-6 pb-8">
      {/* 1. TOP STATS */}
      <OverviewStats />

      {/* 2. MAIN GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 h-full">
        {/* Chart chiếm 4 cột */}
        <div className="lg:col-span-4">
          <ContributionChart />
        </div>

        {/* Activity chiếm 3 cột */}
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
