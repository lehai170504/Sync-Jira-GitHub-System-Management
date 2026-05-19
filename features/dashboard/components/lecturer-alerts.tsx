"use client";

import { AlertTriangle, Ghost, Skull, UserX, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GhostStudent {
  full_name: string;
  team_name: string;
}

interface AlertsData {
  ghost_students_count?: number;
  ghost_students_list?: GhostStudent[];
  inactive_teams?: string[];
}

interface LecturerAlertsProps {
  alerts?: AlertsData;
}

export function LecturerAlerts({ alerts }: LecturerAlertsProps) {
  return (
    <Card className="lg:col-span-8 border-none shadow-xl shadow-red-200/20 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border-l-4 border-l-red-500">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400 tracking-tight flex items-center gap-3">
          <AlertTriangle className="h-6 w-6" /> Cảnh Báo Vận Hành Lớp
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8 flex flex-col md:flex-row gap-6">
        {/* Ghost students */}
        <div className="flex-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
              <Ghost className="w-4 h-4" /> Sinh viên "Tàng hình"
            </h4>
            <Badge className="bg-red-500 text-white hover:bg-red-600">
              {alerts?.ghost_students_count || 0}
            </Badge>
          </div>
          <p className="text-[10px] text-red-600/70 dark:text-red-400/70 mb-3 font-medium uppercase tracking-wider">
            (0 Commit, 0 Task Done)
          </p>
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-200 dark:scrollbar-thumb-red-900">
            {alerts?.ghost_students_list?.length ? (
              alerts.ghost_students_list.map((ghost, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-lg border border-red-100 dark:border-red-900/30"
                >
                  <UserX className="w-4 h-4 text-red-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {ghost.full_name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{ghost.team_name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Toàn bộ sinh viên đều có tham gia làm bài.
              </p>
            )}
          </div>
        </div>

        {/* Inactive teams */}
        <div className="flex-1 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Skull className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300">
              Nhóm "Ngủ đông" (Chưa Sync)
            </h4>
          </div>
          <div className="space-y-2">
            {alerts?.inactive_teams?.length ? (
              alerts.inactive_teams.map((teamName, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-white dark:bg-slate-900 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 w-full justify-start py-2"
                >
                  {teamName}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Tất cả các nhóm đã kết nối Jira/Git.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
