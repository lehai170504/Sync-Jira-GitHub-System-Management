// src/features/admin/components/dashboard/dashboard-header.tsx
"use client";

import { Download, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  onStartTour: () => void;
}

export function DashboardHeader({ onStartTour }: DashboardHeaderProps) {
  return (
    <div
      id="dashboard-header"
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6"
    >
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
          Dashboard
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Thứ Năm, 12 tháng 02, 2026 • Hệ thống hoạt động bình thường.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm nhanh..."
            className="pl-9 w-[250px] rounded-xl bg-slate-50 border-slate-200"
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onStartTour}
                className="rounded-full border-slate-200 text-slate-500 hover:text-[#F27124] hover:border-[#F27124]"
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
