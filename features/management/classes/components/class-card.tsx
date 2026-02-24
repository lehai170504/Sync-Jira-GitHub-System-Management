"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookOpen, ArrowRight, User } from "lucide-react";
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
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "Finished":
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    }
  };

  return (
    <Card
      className="group hover:shadow-md hover:-translate-y-1 transition-all duration-300 border-slate-200 dark:border-slate-800 rounded-[20px] overflow-hidden cursor-pointer bg-white dark:bg-slate-900 flex flex-col h-full"
      onClick={() => onViewDetails(cls)}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="secondary"
            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-none font-semibold text-[10px] uppercase tracking-wider"
          >
            {cls.semester_id?.code || "N/A"}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.5 border font-semibold tracking-wider uppercase ${getStatusColor(
              cls.status || "Active",
            )}`}
          >
            {cls.status === "Active" ? "Đang dạy" : cls.status}
          </Badge>
        </div>

        <div>
          <h3
            className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1"
            title={cls.name}
          >
            {cls.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500 dark:text-slate-400">
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium" title={cls.subjectName}>
              {cls.subjectName}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1">
        <div className="flex items-center gap-3 mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 transition-colors">
          <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Giảng viên
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate mt-0.5">
              {cls.lecturer_id?.full_name || "Chưa phân công"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-transparent flex justify-end">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider">
          Chi tiết
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </CardFooter>
    </Card>
  );
}
