"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import { Class } from "@/features/management/classes/types/class-types";

interface ClassCardProps {
  cls: Class;
  onEdit: (cls: Class) => void;
  onViewDetails: (cls: Class) => void;
}

export function ClassCard({ cls, onViewDetails }: ClassCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "Finished":
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    }
  };

  return (
    <Card
      className="group hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between"
      onClick={() => onViewDetails(cls)}
    >
      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start">
          <Badge
            variant="outline"
            className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-mono text-xs px-2 py-0.5 rounded-md"
          >
            {cls.semester_id?.code || "N/A"}
          </Badge>
        </div>

        <div className="mt-2">
          <h3
            className="text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#F27124] transition-colors line-clamp-1"
            title={cls.name}
          >
            {cls.name}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
            <div
              className="flex items-center gap-1.5 max-w-[120px] truncate"
              title={cls.subjectName}
            >
              <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{cls.subjectName}</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 h-5 border ${getStatusColor(
                cls.status || "Active",
              )}`}
            >
              {cls.status || "Active"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="flex items-center gap-3 mt-4 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 group-hover:bg-orange-50/30 dark:group-hover:bg-orange-900/10 group-hover:border-orange-100 dark:group-hover:border-orange-900/20 transition-colors">
          <Avatar className="h-9 w-9 border border-white dark:border-slate-700 shadow-sm">
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
              {cls.lecturer_id?.full_name?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Giảng viên
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
              {cls.lecturer_id?.full_name || "Chưa phân công"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-end mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(cls);
          }}
          className="group/btn text-xs text-[#F27124] font-bold flex items-center gap-1.5 hover:underline transition-all"
        >
          Xem chi tiết
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </CardFooter>
    </Card>
  );
}
