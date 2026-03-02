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
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors leading-none">
                      {cls.className}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wide">
                      {cls.subjectCode}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-none px-2.5 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider shrink-0 transition-colors"
                  >
                    {cls.semester || "N/A"}
                  </Badge>
                </div>

                <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm line-clamp-2 leading-snug transition-colors">
                  {cls.subjectName}
                </p>
              </CardHeader>

              {/* BODY: Thông tin Nhóm học */}
              <CardContent className="py-0 flex-1 flex flex-col justify-center">
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 space-y-4 border border-slate-100 dark:border-slate-800/60 transition-colors">
                  {/* Tên Nhóm */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                      <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
                        Tên Nhóm
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight transition-colors">
                        {cls.teamName || "Chưa có nhóm"}
                      </p>
                    </div>
                  </div>

                  {/* Dòng kẻ chia */}
                  <div className="h-px bg-slate-200 dark:bg-slate-800 transition-colors" />

                  {/* Vai trò */}
                  <div className="flex items-center gap-2">
                    {cls.isLeader ? (
                      <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-200 dark:hover:bg-orange-900/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-none">
                        <Crown className="w-3.5 h-3.5 mr-1.5" />
                        Nhóm Trưởng
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
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
                <div className="text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  Vào Dashboard
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
