"use client";

import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { useClassDashboard } from "@/features/lecturer/hooks/use-dashboard";
import { Sparkles } from "lucide-react";
import { KpiCardSkeleton, ChartSkeleton, CardSkeleton } from "@/components/ui/skeletons";

import { LecturerHero } from "./lecturer-hero";
import { LecturerEmptyState } from "./lecturer-empty-state";
import { LecturerKpiCards } from "./lecturer-kpi-cards";
import { LecturerScoreChart } from "./lecturer-score-chart";
import { LecturerLeaderboard } from "./lecturer-leaderboard";
import { LecturerAlerts } from "./lecturer-alerts";
import { LecturerBroadcast } from "./lecturer-broadcast";

interface LecturerDashboardProps {
  classId?: string;
}

export function LecturerDashboard({ classId }: LecturerDashboardProps) {
  const { data: classDetails, isLoading: isClassLoading } = useClassDetails(classId);
  const { data: dashboardData, isLoading: isDashboardLoading } = useClassDashboard(classId);

  const className = classDetails?.class?.name || "Đang tải...";
  const subjectCode = classDetails?.class?.subject_id?.code || "...";

  const overview = dashboardData?.overview;
  const distribution = dashboardData?.distribution;
  const leaderboards = dashboardData?.leaderboards;
  const alerts = dashboardData?.alerts;

  const hasStudents = (overview?.total_students || 0) > 0;

  if (!classId) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <Sparkles className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-medium">Vui lòng chọn một lớp học để xem tổng quan.</p>
      </div>
    );
  }

  if (isClassLoading || isDashboardLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="space-y-3">
            <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-9 w-72 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
        <KpiCardSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <CardSkeleton count={3} cols={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 font-sans transition-colors duration-300">
      <LecturerHero className={className} subjectCode={subjectCode} />

      {!hasStudents ? (
        <LecturerEmptyState />
      ) : (
        <>
          <LecturerKpiCards overview={overview} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <LecturerScoreChart
              distribution={distribution}
              overview={overview}
            />
            <LecturerLeaderboard leaderboards={leaderboards} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <LecturerAlerts alerts={alerts} />
            <LecturerBroadcast classId={classId!} className={className} />
          </div>
        </>
      )}
    </div>
  );
}
