"use client";

import { format } from "date-fns";
import { Calendar, BookOpen } from "lucide-react";
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
      className={`group relative p-6 rounded-[24px] border transition-all duration-300 cursor-pointer overflow-hidden
        ${
          isActive
            ? "bg-white border-[#F27124]/30 shadow-[0_8px_30px_rgba(242,113,36,0.15)] hover:shadow-[0_8px_40px_rgba(242,113,36,0.25)] hover:-translate-y-1"
            : "bg-white border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 hover:-translate-y-1"
        }
      `}
    >
      {/* Decorative Blur for Active Card */}
      {isActive && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="space-y-1">
          <Badge
            variant="secondary"
            className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border-0
              ${
                isActive
                  ? "bg-[#F27124] text-white shadow-md shadow-orange-200"
                  : "bg-slate-100 text-slate-500"
              }
            `}
          >
            {isActive ? "Đang diễn ra" : "Lưu trữ"}
          </Badge>
          <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#F27124] transition-colors">
            {semester.name}
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mã: {semester.code}
          </p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="p-2 bg-slate-50 rounded-lg">
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Thời gian
            </span>
            <span className="font-semibold text-xs">
              {format(new Date(semester.start_date), "dd/MM/yyyy")} -{" "}
              {format(new Date(semester.end_date), "dd/MM/yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Action Line */}
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#F27124] transition-colors uppercase tracking-widest">
          Xem chi tiết
        </span>
        <div className="h-6 w-6 rounded-full bg-slate-50 group-hover:bg-[#F27124] flex items-center justify-center transition-colors">
          <BookOpen className="h-3 w-3 text-slate-400 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
}
