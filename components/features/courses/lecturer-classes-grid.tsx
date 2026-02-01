"use client";

import { ArrowRight, Search, Sparkles, Target, BarChart3 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
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
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-up font-mono">
        <div className="relative mb-6">
          <div className="absolute -inset-4 border border-dashed border-slate-200 rounded-full animate-orbit-slow opacity-50" />
          <div className="bg-white p-6 rounded-full shadow-xl relative z-10">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">
          Không tìm thấy lớp học
        </h3>
        <Button
          variant="outline"
          className="mt-8 rounded-xl border-slate-200 font-black text-[10px] tracking-widest uppercase hover:bg-slate-50 active:scale-95 transition-all"
          onClick={onClearFilter}
        >
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20 font-mono">
      <AnimatePresence mode="popLayout">
        {classes.map((cls, index) => (
          <motion.div
            key={cls._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card
              className="group overflow-hidden border-slate-100 rounded-[32px] shadow-2xl shadow-slate-200/50 hover:shadow-orange-500/10 transition-all duration-500 cursor-pointer flex flex-col h-full bg-white relative hover:-translate-y-2 active:scale-[0.98]"
              onClick={() => onSelectClass(cls)}
            >
              {/* HEADER */}
              <div
                className={`h-36 ${cls.color} relative p-6 flex flex-col justify-between overflow-hidden`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                  <Sparkles className="w-20 h-20 text-white" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <Badge className="bg-black/20 text-white text-[9px] font-black px-3 py-1 rounded-full backdrop-blur-md border-0 tracking-widest uppercase">
                    {cls.semester_id?.name ?? "N/A"}
                  </Badge>
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="text-white w-4 h-4" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white leading-none tracking-tighter italic">
                    {cls.name}
                  </h3>
                  <p className="text-white/80 text-[10px] font-black tracking-widest mt-1 opacity-70 uppercase">
                    {cls.subject_id?.code ?? cls.class_code ?? "N/A"}
                  </p>
                </div>
              </div>

              {/* BODY */}
              <CardContent className="flex-1 p-6 flex flex-col">
                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-4 group-hover:text-[#F27124] transition-colors line-clamp-2 italic">
                  {cls.subjectName ?? cls.subject_id?.name}
                </h4>

                <div className="space-y-3 mt-auto pt-4 border-t border-slate-50">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-blue-500" />
                      <span>
                        Jira:{" "}
                        {Math.round(
                          (cls.contributionConfig?.jiraWeight ?? 0) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-orange-500" />
                      <span>
                        Git:{" "}
                        {Math.round(
                          (cls.contributionConfig?.gitWeight ?? 0) * 100,
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {cls.gradeStructure?.length
                        ? `${cls.gradeStructure.length} cột điểm`
                        : "Chưa cấu hình điểm"}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* FOOTER */}
              <CardFooter className="px-6 py-4 bg-slate-50/50 flex justify-between items-center group-hover:bg-[#F27124]/5 transition-colors">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                      cls.status === "Active"
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  />
                  <span className="text-[9px] font-black text-slate-400 group-hover:text-[#F27124] uppercase tracking-[0.2em]">
                    {cls.status}
                  </span>
                </div>
                <div className="h-7 w-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:border-[#F27124] group-hover:rotate-12 transition-all shadow-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#F27124]" />
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
