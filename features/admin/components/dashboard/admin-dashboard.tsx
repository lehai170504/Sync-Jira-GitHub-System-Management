"use client";

import { useAdminTour } from "@/features/admin/hooks/use-admin-tour";
import { useAdminOverview } from "@/features/admin/hooks/use-dashboard";
import { DashboardHeader } from "./dashboard-header";
import { DashboardMetrics } from "./dashboard-metrics";
import { DashboardCharts } from "./dashboard-charts";
import { RecentUsersTable } from "./recent-users-table";
import { Loader2 } from "lucide-react";

export function AdminDashboard() {
  const { startTour } = useAdminTour();
  const { data, isLoading } = useAdminOverview();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#F27124]" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">
          Đang tổng hợp hệ thống...
        </p>
      </div>
    );
  }

  // ĐÃ FIX: Backend bọc dữ liệu trong 1 tầng "data" nữa
  // nên mình phải chọc vào data?.data
  const overviewData = data?.data;

  const currentSemester = overviewData?.current_semester;
  const metrics = overviewData?.metrics;
  const usersBreakdown = overviewData?.users_breakdown;

  return (
    <div className="flex-1 space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Đẩy data xuống các Component con */}
      <DashboardHeader onStartTour={startTour} semester={currentSemester} />
      <DashboardMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-5 h-full">
          <DashboardCharts breakdown={usersBreakdown} />
        </div>
        <div className="lg:col-span-7 h-full">
          <RecentUsersTable />
        </div>
      </div>
    </div>
  );
}
