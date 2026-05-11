"use client";

import { ArrowRight, Search, Users, Crown, Github, Trello } from "lucide-react";
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
import type { StudentClassItem } from "../types/course-types";

interface StudentClassesGridProps {
  classes: StudentClassItem[];
  onSelectClass: (cls: StudentClassItem) => void;
  onClearFilter: () => void;
}

export function StudentClassesGrid({
  classes,
  onSelectClass,
  onClearFilter,
}: StudentClassesGridProps) {
  // --- TRẠNG THÁI TRỐNG (EMPTY STATE) ---
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

  // --- LƯỚI THẺ LỚP HỌC (SUBTLE GRID) ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 font-sans">
      <AnimatePresence mode="popLayout">
        {classes.map((cls, index) => (
          <motion.div
            key={cls.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
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

              <CardHeader className="pt-6 pb-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors leading-none">
                      {cls.className}
                    </h3>
                    {cls.subjectCode && cls.subjectCode !== cls.className && (
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wide">
                        {cls.subjectCode}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-none px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-[0.1em] shrink-0 transition-colors"
                  >
                    {cls.semester || "N/A"}
                  </Badge>
                </div>

                {cls.subjectName &&
                  cls.subjectName !== cls.className &&
                  cls.subjectName !== cls.subjectCode && (
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm line-clamp-2 leading-snug transition-colors">
                      {cls.subjectName}
                    </p>
                  )}
              </CardHeader>

              {/* BODY: Thông tin Nhóm học */}
              <CardContent className="py-0 flex-1 flex flex-col justify-center">
                <div className="bg-zinc-50/50 dark:bg-black/20 rounded-[24px] p-5 space-y-4 border border-zinc-100 dark:border-white/5 transition-all group-hover:border-orange-500/20">
                  {/* Tên Nhóm */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-white/5 transition-all group-hover:scale-110">
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">
                        Project Team
                      </p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight transition-colors">
                        {cls.teamName || "Chưa có nhóm"}
                      </p>
                    </div>
                  </div>

                  {/* Dòng kẻ chia */}
                  <div className="h-px bg-slate-200 dark:bg-slate-800 transition-colors" />

                  {/* Vai trò */}
                  <div className="flex items-center gap-2">
                    {cls.isLeader ? (
                      <Badge className="bg-orange-500 text-white border-none px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(242,113,36,0.3)] group-hover:shadow-[0_8px_20px_rgba(242,113,36,0.5)] rounded-lg">
                        <Crown className="w-3 h-3 mr-1.5 fill-current" />
                        Nhóm Trưởng
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-none px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-colors rounded-lg"
                      >
                        Thành Viên
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* FOOTER: Action */}
              <CardFooter className="pt-5 pb-5 flex items-center justify-between mt-auto bg-transparent">
                {/* Trạng thái công việc cơ bản (Tùy chọn - bạn có thể đổi logic này hoặc xóa) */}
                <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 transition-colors">
                  <Github className="w-4 h-4" />
                  <Trello className="w-4 h-4" />
                </div>

                {/* Call to action (Mũi tên trượt nhẹ) */}
                <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]">
                  Vào Dashboard
                  <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
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
