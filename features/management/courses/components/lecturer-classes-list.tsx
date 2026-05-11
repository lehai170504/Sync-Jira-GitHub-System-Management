"use client";

import { Search, ArrowRight, BookOpen, Target, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { LecturerClassDisplayItem } from "./lecturer-classes-grid";
import { cn } from "@/lib/utils";

interface LecturerClassesListProps {
  classes: LecturerClassDisplayItem[];
  onSelectClass: (cls: LecturerClassDisplayItem) => void;
  onClearFilter: () => void;
}

export function LecturerClassesList({
  classes,
  onSelectClass,
  onClearFilter,
}: LecturerClassesListProps) {
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 font-sans">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-full border border-slate-100 dark:border-slate-800 mb-6">
          <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Không tìm thấy lớp học nào
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          Thử thay đổi từ khóa tìm kiếm hoặc chọn một học kỳ khác để xem kết quả.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          onClick={onClearFilter}
        >
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20 font-sans relative z-10">
      {/* List Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 border-b border-slate-200 dark:border-white/5">
        <div className="col-span-4 pl-4">Lớp Học / Môn Học</div>
        <div className="col-span-2 text-center">Học Kỳ</div>
        <div className="col-span-3 text-center">Trọng số Đánh giá</div>
        <div className="col-span-2 text-center">Trạng Thái</div>
        <div className="col-span-1 text-right pr-4">Thao Tác</div>
      </div>

      <AnimatePresence mode="popLayout">
        {classes.map((cls, index) => (
          <motion.div
            key={cls._id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <div
              onClick={() => onSelectClass(cls)}
              className="group relative flex flex-col lg:grid lg:grid-cols-12 gap-4 items-center bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-white/50 dark:border-white/5 p-4 lg:p-6 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/20 cursor-pointer transition-all duration-500 overflow-hidden"
            >
              {/* Vạch màu bên trái */}
              <div
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5 opacity-80 group-hover:w-2 transition-all duration-500",
                  cls.color,
                )}
              />

              {/* Tên Lớp & Môn Học */}
              <div className="col-span-4 flex flex-col w-full pl-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {cls.name}
                  </h3>
                  {cls.subject_id?.code && cls.subject_id.code !== cls.name && (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2"
                    >
                      {cls.subject_id.code}
                    </Badge>
                  )}
                  {cls.class_code &&
                    cls.class_code !== cls.subject_id?.code &&
                    cls.class_code !== cls.name && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[9px] font-bold px-2"
                      >
                        {cls.class_code}
                      </Badge>
                    )}
                </div>
                {(() => {
                  const subName = cls.subjectName ?? cls.subject_id?.name;
                  if (!subName || subName === cls.name || subName === cls.subject_id?.code || subName === cls.class_code) return null;
                  return (
                    <p className="text-sm font-semibold text-slate-500 dark:text-zinc-500 line-clamp-1 italic">
                      {subName}
                    </p>
                  );
                })()}
              </div>

              {/* Học Kỳ */}
              <div className="col-span-2 w-full flex justify-between lg:justify-center items-center">
                <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Học kỳ:
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800/80 px-3 py-1.5 rounded-full transition-colors">
                  {cls.semester_id?.name ?? "N/A"}
                </span>
              </div>

              {/* Trọng số đánh giá */}
              <div className="col-span-3 w-full flex justify-between lg:justify-center items-center gap-4">
                <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Trọng số:
                </span>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/20 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2" title="Jira Weight">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                      {Math.round((cls.contributionConfig?.jiraWeight ?? 0) * 100)}%
                    </span>
                  </div>
                  <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800" />
                  <div className="flex items-center gap-2" title="Git Weight">
                    <GitCommit className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                      {Math.round((cls.contributionConfig?.gitWeight ?? 0) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Trạng Thái */}
              <div className="col-span-2 w-full flex justify-between lg:justify-center items-center">
                <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Trạng thái:
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    {cls.status === "Active" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span
                      className={cn(
                        "relative inline-flex rounded-full h-2 w-2 transition-colors",
                        cls.status === "Active" ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-700"
                      )}
                    ></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-[0.15em] transition-colors">
                    {cls.status === "Active" ? "Active" : cls.status}
                  </span>
                </div>
              </div>

              {/* Hành Động */}
              <div className="col-span-1 w-full flex justify-end items-center mt-2 lg:mt-0 pr-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-sm">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
