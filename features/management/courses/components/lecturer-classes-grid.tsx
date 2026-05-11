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
          Thử thay đổi từ khóa tìm kiếm hoặc chọn một học kỳ khác để xem kết quả.
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

  // --- LƯỚI THẺ LỚP HỌC (PREMIUM GRID) ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20 font-sans relative z-10">
      <AnimatePresence mode="popLayout">
        {classes.map((cls, index) => (
          <motion.div
            key={cls._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="h-full"
          >
            <Card
              className="group h-full flex flex-col relative overflow-hidden cursor-pointer bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border-white/50 dark:border-white/5 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(242,113,36,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(242,113,36,0.25)] hover:-translate-y-2 transition-all duration-500 rounded-[32px]"
              onClick={() => onSelectClass(cls)}
            >
              {/* Thanh viền màu trên cùng (Accent Color) */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-2 opacity-80 group-hover:opacity-100 group-hover:h-3 transition-all duration-500",
                  cls.color,
                )}
              />

              {/* HEADER: Tên lớp & Môn học */}
              <CardHeader className="pt-8 pb-4 px-7">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors leading-none truncate">
                      {cls.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {cls.subject_id?.code && cls.subject_id.code !== cls.name && (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest bg-slate-50 dark:bg-black/20 px-1.5 py-0.5 rounded-md">
                          {cls.subject_id.code}
                        </span>
                      )}
                      {cls.class_code &&
                        cls.class_code !== cls.subject_id?.code &&
                        cls.class_code !== cls.name && (
                          <>
                            <span className="text-slate-200 dark:text-zinc-800">•</span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest bg-slate-50 dark:bg-black/20 px-1.5 py-0.5 rounded-md">
                              {cls.class_code}
                            </span>
                          </>
                        )}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-none px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-[0.1em] shrink-0 transition-colors"
                  >
                    {cls.semester_id?.name ?? "N/A"}
                  </Badge>
                </div>

                {(() => {
                  const subName = cls.subjectName ?? cls.subject_id?.name;
                  if (!subName || subName === cls.name || subName === cls.subject_id?.code || subName === cls.class_code) return null;
                  return (
                    <p className="font-semibold text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed transition-colors">
                      {subName}
                    </p>
                  );
                })()}
              </CardHeader>

              {/* BODY: Thông số cấu hình */}
              <CardContent className="py-0 px-7 flex-1 flex flex-col justify-center">
                <div className="bg-zinc-50/50 dark:bg-black/20 rounded-[24px] p-5 space-y-4 border border-zinc-100 dark:border-white/5 transition-all group-hover:border-orange-500/20">
                  {/* Trọng số */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">
                        <Target className="w-3.5 h-3.5 text-blue-500" />
                        <span>Jira Task</span>
                      </div>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none transition-colors">
                        {Math.round((cls.contributionConfig?.jiraWeight ?? 0) * 100)}%
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">
                        <GitCommit className="w-3.5 h-3.5 text-orange-500" />
                        <span>Git Code</span>
                      </div>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none transition-colors">
                        {Math.round((cls.contributionConfig?.gitWeight ?? 0) * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Dòng kẻ chia */}
                  <div className="h-px bg-slate-200/50 dark:bg-white/5 transition-colors" />

                  {/* Cột điểm */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-white/5 transition-colors">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight transition-colors">
                      {cls.gradeStructure?.length
                        ? `${cls.gradeStructure.length} Cột điểm cấu hình`
                        : "Chưa cấu hình cột điểm"}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* FOOTER: Trạng thái & Action */}
              <CardFooter className="pt-6 pb-7 px-7 flex items-center justify-between mt-auto bg-transparent">
                {/* Status Indicator */}
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    {cls.status === "Active" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span
                      className={cn(
                        "relative inline-flex rounded-full h-2.5 w-2.5 transition-colors",
                        cls.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-zinc-700",
                      )}
                    ></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-[0.1em] transition-colors">
                    {cls.status === "Active" ? "Đang giảng dạy" : cls.status}
                  </span>
                </div>

                {/* Call to action */}
                <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]">
                  Vào lớp
                  <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
