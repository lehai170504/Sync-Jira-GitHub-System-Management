"use client";

import { ArrowRight, Search, Target, GitCommit, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LecturerClassItem } from "@/features/management/lecturers/types/lecturer-classes-types";

export interface LecturerClassDisplayItem extends LecturerClassItem {
  color: string;
}

interface LecturerClassesGridProps {
  classes: LecturerClassDisplayItem[];
  onSelectClass: (cls: LecturerClassDisplayItem) => void;
  onClearFilter: () => void;
}

export function LecturerClassesGrid({
  classes,
  onSelectClass,
  onClearFilter,
}: LecturerClassesGridProps) {
  // --- TRẠNG THÁI TRỐNG (EMPTY STATE) ---
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 font-sans transition-colors">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-full border border-slate-100 dark:border-slate-800 mb-6 transition-colors">
          <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors">
          Không tìm thấy lớp học nào
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm transition-colors">
          Thử thay đổi từ khóa tìm kiếm hoặc chọn một học kỳ khác để xem kết
          quả.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          onClick={onClearFilter}
        >
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  // --- LƯỚI THẺ LỚP HỌC (SUBTLE GRID) ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 font-sans">
      <AnimatePresence mode="popLayout">
        {classes.map((cls, index) => (
          <motion.div
            key={cls._id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="h-full"
          >
            <Card
              className="group h-full flex flex-col relative overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              onClick={() => onSelectClass(cls)}
            >
              {/* Thanh viền màu trên cùng (Accent Color) */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-1.5 opacity-90 transition-colors",
                  cls.color,
                )}
              />

              {/* HEADER: Tên lớp & Môn học */}
              <CardHeader className="pt-6 pb-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none">
                      {cls.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wide transition-colors">
                      {cls.subject_id?.code ?? cls.class_code ?? "N/A"}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-none px-2.5 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider shrink-0 transition-colors"
                  >
                    {cls.semester_id?.name ?? "N/A"}
                  </Badge>
                </div>

                <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm line-clamp-2 leading-snug transition-colors">
                  {cls.subjectName ?? cls.subject_id?.name}
                </p>
              </CardHeader>

              {/* BODY: Thông số cấu hình */}
              <CardContent className="py-0 flex-1 flex flex-col justify-center">
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-800/60 transition-colors">
                  {/* Trọng số */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                        <Target className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                        <span>Jira Task</span>
                      </div>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none transition-colors">
                        {Math.round(
                          (cls.contributionConfig?.jiraWeight ?? 0) * 100,
                        )}
                        %
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                        <GitCommit className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                        <span>Git Code</span>
                      </div>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none transition-colors">
                        {Math.round(
                          (cls.contributionConfig?.gitWeight ?? 0) * 100,
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  {/* Dòng kẻ chia */}
                  <div className="h-px bg-slate-200 dark:bg-slate-800 transition-colors" />

                  {/* Cột điểm */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors">
                    <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>
                      {cls.gradeStructure?.length
                        ? `${cls.gradeStructure.length} Cột điểm được cấu hình`
                        : "Chưa cấu hình cột điểm"}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* FOOTER: Trạng thái & Action */}
              <CardFooter className="pt-5 pb-5 flex items-center justify-between mt-auto bg-transparent">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    {cls.status === "Active" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span
                      className={cn(
                        "relative inline-flex rounded-full h-2.5 w-2.5 transition-colors",
                        cls.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-600",
                      )}
                    ></span>
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest transition-colors">
                    {cls.status === "Active" ? "Đang giảng dạy" : cls.status}
                  </span>
                </div>

                {/* Call to action (Mũi tên trượt nhẹ) */}
                <div className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  Vào lớp
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
