"use client";

import { format } from "date-fns";
import { Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SemesterCardProps {
  semester: any;
  onClick: () => void;
}

export function SemesterCard({ semester, onClick }: SemesterCardProps) {
  const isActive = semester.status === "OPEN";

  return (
    <div
      onClick={onClick}
      className={`group relative p-6 rounded-[24px] border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full
        ${
          isActive
            ? "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/30 hover:shadow-lg hover:-translate-y-1"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1"
        }
      `}
    >
      {/* Viền trái để nhận diện nhanh trạng thái (Accent Line) */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${isActive ? "bg-emerald-500" : "bg-transparent group-hover:bg-blue-400"}`}
      />

      <div className="flex justify-between items-start mb-6">
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={`font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md
            ${
              isActive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-none"
            }
          `}
        >
          {isActive ? "Đang diễn ra" : "Đã đóng"}
        </Badge>
        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
          {semester.code}
        </span>
      </div>

      <div className="mb-6 flex-1">
        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {semester.name}
        </h3>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors">
            <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Thời gian
            </span>
            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
              {format(new Date(semester.start_date), "dd/MM/yy")} -{" "}
              {format(new Date(semester.end_date), "dd/MM/yy")}
            </span>
          </div>
        </div>

        {/* Action Line */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <div className="text-xs font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-wider flex items-center gap-1.5">
            Chi tiết
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
