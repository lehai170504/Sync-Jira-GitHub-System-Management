"use client";

import { Download, HelpCircle, Search, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  onStartTour: () => void;
  semester?: any;
}

export function DashboardHeader({
  onStartTour,
  semester,
}: DashboardHeaderProps) {
  const hasSemester = !!semester;

  return (
    <div
      id="dashboard-header"
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 transition-colors"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-50 uppercase flex items-center gap-3">
          Thống kê hệ thống
          {hasSemester && (
            <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full border-none">
              {semester.name}
            </span>
          )}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
          <CalendarClock className="w-4 h-4" />
          {hasSemester
            ? `Hoạt động từ ${format(
                new Date(semester.start_date),
                "dd/MM/yyyy"
              )} đến ${format(new Date(semester.end_date), "dd/MM/yyyy")}`
            : "Chưa có học kỳ nào đang mở."}
        </p>
      </div>

      {/* Search và Tooltip giữ nguyên như cũ */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Tìm kiếm nhanh..."
            className="pl-9 w-[250px] rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-200 focus:border-[#F27124] dark:focus:border-[#F27124]"
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onStartTour}
                className="rounded-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-[#F27124] dark:hover:text-[#F27124] hover:border-[#F27124] dark:hover:border-[#F27124]"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hướng dẫn Admin</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20">
          <Download className="mr-2 h-4 w-4" /> Báo Cáo
        </Button>
      </div>
    </div>
  );
}
