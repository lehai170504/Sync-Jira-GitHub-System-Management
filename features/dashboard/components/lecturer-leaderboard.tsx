"use client";

import { Trophy, Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Contributor {
  full_name: string;
  team_name: string;
  factor: number;
}

interface LeaderboardData {
  top_individual_contributors?: Contributor[];
}

interface LecturerLeaderboardProps {
  leaderboards?: LeaderboardData;
}

export function LecturerLeaderboard({ leaderboards }: LecturerLeaderboardProps) {
  return (
    <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden">
      <CardHeader className="px-8 pt-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          Bảng Vinh Danh (Top Performers)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Medal className="w-4 h-4 text-purple-500" /> Top Cá Nhân "Gánh Team"
            </h3>
            {leaderboards?.top_individual_contributors?.length ? (
              leaderboards.top_individual_contributors.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="w-6 h-6 shrink-0 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{user.team_name}</p>
                  </div>
                  <span className="text-xs font-semibold text-purple-600 shrink-0">
                    {Number(user.factor).toFixed(2)}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
