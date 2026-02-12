// src/features/admin/components/admin-dashboard.tsx
"use client";

import { useAdminTour } from "@/features/admin/hooks/use-admin-tour";
import { DashboardHeader } from "./dashboard-header";
import { DashboardMetrics } from "./dashboard-metrics";
import { DashboardCharts } from "./dashboard-charts";
import { RecentUsersTable } from "./recent-users-table";

export function AdminDashboard() {
  const { startTour } = useAdminTour();

  return (
    <div className="flex-1 space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader onStartTour={startTour} />
      <DashboardMetrics />
      <DashboardCharts />
      <RecentUsersTable />
    </div>
  );
}
