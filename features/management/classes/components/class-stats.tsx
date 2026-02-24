"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Class } from "@/features/management/classes/types/class-types";

// Đã đổi kiểu prop nhận vào theo file số 1 (Nhận từng thông số thay vì mảng Data)
export function ClassStats({
  totalStudents,
  totalTeams,
  jiraWeight,
}: {
  totalStudents: number;
  totalTeams: number;
  jiraWeight: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Tổng sinh viên
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {totalStudents}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Số lượng nhóm
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {totalTeams}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Trọng số Jira
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {Math.round(jiraWeight * 100)}%
              </h3>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
