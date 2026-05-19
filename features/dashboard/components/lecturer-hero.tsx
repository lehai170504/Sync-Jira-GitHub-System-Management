"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LecturerHeroProps {
  className: string;
  subjectCode: string;
}

export function LecturerHero({ className, subjectCode }: LecturerHeroProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-[0.02] pointer-events-none">
        <Sparkles className="w-40 h-40 text-[#F27124]" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Badge className="bg-orange-100 dark:bg-orange-900/20 text-[#F27124] dark:text-orange-400 mb-2 uppercase tracking-[0.2em] text-[10px] font-semibold px-4 py-1 rounded-full border-none">
            Lecturer Workspace
          </Badge>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-slate-900 dark:text-slate-50 leading-tight">
            Dashboard Lớp học
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium flex items-center gap-2 flex-wrap">
            Đang xem báo cáo AI cho lớp{" "}
            <span className="text-[#F27124] dark:text-orange-400 font-semibold underline decoration-2 underline-offset-4 decoration-orange-200 dark:decoration-orange-900/50">
              {className}
            </span>
            môn{" "}
            <span className="text-slate-900 dark:text-slate-100 font-semibold">
              {subjectCode}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
