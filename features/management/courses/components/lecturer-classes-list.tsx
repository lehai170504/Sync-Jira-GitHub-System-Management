"use client";

import { Search, ArrowRight, BookOpen, Target, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { LecturerClassDisplayItem } from "./lecturer-classes-grid";

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
          Thử thay đổi từ khóa tìm kiếm hoặc chọn một học kỳ khác để xem kết
          quả.
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
    <div className="flex flex-col gap-3 pb-20 font-sans">
      {/* List Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
        <div className="col-span-4">Lớp Học / Môn Học</div>
        <div className="col-span-2 text-center">Học Kỳ</div>
        <div className="col-span-3 text-center">Trọng số Đánh giá</div>
        <div className="col-span-2 text-center">Trạng Thái</div>
        <div className="col-span-1 text-right">Thao Tác</div>
      </div>

      <AnimatePresence mode="popLayout">
        {classes.map((cls, index) => (
          <motion.div
            key={cls._id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
          >
            <div
              onClick={() => onSelectClass(cls)}
              className="group relative flex flex-col lg:grid lg:grid-cols-12 gap-4 items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 lg:p-6 rounded-[24px] shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 cursor-pointer transition-all duration-300 overflow-hidden"
            >
              {/* Vạch màu bên trái */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 opacity-80 ${cls.color}`}
              />

              {/* Tên Lớp & Môn Học */}
              <div className="col-span-4 flex flex-col w-full pl-2">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cls.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-widest text-[9px] font-bold"
                  >
                    {cls.subject_id?.code ?? cls.class_code}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                  {cls.subjectName ?? cls.subject_id?.name}
                </p>
              </div>

              {/* Học Kỳ */}
              <div className="col-span-2 w-full flex justify-between lg:justify-center items-center">
                <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">
                  Học kỳ:
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-lg">
                  {cls.semester_id?.name ?? "N/A"}
                </span>
              </div>

              {/* Trọng số đánh giá */}
              <div className="col-span-3 w-full flex justify-between lg:justify-center items-center gap-4">
                <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">
                  Trọng số:
                </span>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div
                    className="flex items-center gap-1.5"
                    title="Jira Weight"
                  >
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {Math.round(
                        (cls.contributionConfig?.jiraWeight ?? 0) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-center gap-1.5" title="Git Weight">
                    <GitCommit className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {Math.round(
                        (cls.contributionConfig?.gitWeight ?? 0) * 100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Trạng Thái */}
              <div className="col-span-2 w-full flex justify-between lg:justify-center items-center">
                <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">
                  Trạng thái:
                </span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    {cls.status === "Active" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        cls.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    ></span>
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                    {cls.status === "Active" ? "Đang giảng dạy" : cls.status}
                  </span>
                </div>
              </div>

              {/* Hành Động */}
              <div className="col-span-1 w-full flex justify-end items-center mt-2 lg:mt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
