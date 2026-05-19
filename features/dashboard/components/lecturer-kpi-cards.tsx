"use client";

import { Users, Layers, RefreshCw, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KpiOverview {
  total_students?: number;
  total_teams?: number;
  synced_teams_ratio?: string;
  is_graded?: boolean;
  average_class_grade?: number;
}

interface LecturerKpiCardsProps {
  overview?: KpiOverview;
}

export function LecturerKpiCards({ overview }: LecturerKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Sĩ số */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
        <CardContent className="p-6 flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Sĩ số lớp
            </p>
            <h3 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
              {overview?.total_students || 0}
            </h3>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
            <Users className="h-7 w-7" />
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Số Nhóm */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
        <CardContent className="p-6 flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Số Nhóm Đồ Án
            </p>
            <h3 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
              {overview?.total_teams || 0}
            </h3>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <Layers className="h-7 w-7" />
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Tỷ lệ Sync */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
        <CardContent className="p-6 flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Đồng bộ Hệ thống
            </p>
            <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
              {overview?.synced_teams_ratio || "0/0"}
            </h3>
            <div className="text-[10px] font-bold text-orange-500 uppercase">
              Jira & GitHub
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
            <RefreshCw className="h-7 w-7" />
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Điểm TB */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 rounded-[28px]">
        <CardContent className="p-6 flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Điểm Trung Bình
            </p>
            {overview?.is_graded ? (
              <>
                <h3 className="text-4xl font-semibold text-emerald-600">
                  {Number(overview?.average_class_grade || 0).toFixed(1)}
                </h3>
                <div className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Lớp đã chốt điểm
                </div>
              </>
            ) : (
              <div className="pt-2">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-500 border-none font-bold uppercase text-xs"
                >
                  Chưa chốt điểm
                </Badge>
              </div>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-7 w-7" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
