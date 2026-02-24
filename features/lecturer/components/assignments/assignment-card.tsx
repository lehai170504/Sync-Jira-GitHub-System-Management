"use client";

import {
  CalendarClock,
  CalendarPlus,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Assignment } from "@/features/lecturer/types/assignment-types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  // Mock data tiến độ
  const submitted = assignment.submittedCount || 0;
  const total = assignment.totalStudent || 30;
  const progress = (submitted / total) * 100;

  // Tính trạng thái
  const isExpired = new Date(assignment.deadline) < new Date();
  const status = isExpired ? "Closed" : "Open";

  return (
    <Card className="flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900/50 transition-all duration-300 rounded-[24px] overflow-hidden h-full group">
      <CardContent className="p-5 flex flex-col h-full">
        {/* --- HEADER: Badges & Action --- */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            {/* Loại bài tập */}
            <Badge
              variant="secondary"
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md"
            >
              {assignment.type}
            </Badge>

            {/* Trạng thái */}
            <Badge
              variant="outline"
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border
                ${
                  status === "Open"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                    : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700"
                }`}
            >
              {status === "Open" ? "Đang mở" : "Đã đóng"}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 -mr-2 -mt-1 transition-colors"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* --- BODY: Title & Desc --- */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {assignment.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
            {assignment.description ||
              "Không có mô tả chi tiết cho bài tập này."}
          </p>
        </div>

        {/* --- META INFO: Dates --- */}
        <div className="mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Ngày tạo */}
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-colors">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <CalendarPlus className="h-3.5 w-3.5" /> Tạo
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {format(
                  new Date(assignment.created_at || Date.now()),
                  "dd/MM/yyyy",
                  { locale: vi },
                )}
              </span>
            </div>

            {/* Deadline */}
            <div
              className={`flex flex-col gap-1 p-3 rounded-xl border transition-colors
              ${
                status === "Open"
                  ? "bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-500/30"
                  : "bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50"
              }`}
            >
              <span
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider
                ${status === "Open" ? "text-orange-500 dark:text-orange-400" : "text-slate-400 dark:text-slate-500"}`}
              >
                <CalendarClock className="h-3.5 w-3.5" /> Deadline
              </span>
              <span
                className={`text-xs font-semibold ${
                  status === "Open"
                    ? "text-orange-700 dark:text-orange-300"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {format(new Date(assignment.deadline), "HH:mm dd/MM", {
                  locale: vi,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* --- FOOTER: Progress --- */}
      <CardFooter className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5 transition-colors">
        <div className="w-full flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <Users className="h-4 w-4" />
            <span>Tiến độ nộp bài</span>
          </div>
          <span
            className={`font-bold ${
              progress === 100
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-700 dark:text-slate-200"
            }`}
          >
            {submitted}/{total}
          </span>
        </div>

        <div className="w-full">
          <Progress
            value={progress}
            className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
            indicatorColor={progress === 100 ? "bg-emerald-500" : "bg-blue-500"}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
