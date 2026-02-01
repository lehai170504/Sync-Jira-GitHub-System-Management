"use client";

import { Search, Calendar, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CourseFilterProps {
  title?: string;
  description?: string;
  icon?: ReactNode;

  semesters: string[];
  selectedSemester: string;
  onSemesterChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CourseFilter({
  title = "Các lớp giảng dạy", // Chỉnh lại Default Prop
  description = "Chọn lớp học để bắt đầu quản lý và chấm điểm.", // Chỉnh lại Default Prop
  icon,

  semesters,
  selectedSemester,
  onSemesterChange,
  searchTerm,
  onSearchChange,
}: CourseFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8 font-mono animate-fade-up">
      {/* --- LEFT: TITLE & DESCRIPTION --- */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-orange-50 border border-orange-100 mb-1">
          <Sparkles className="h-3 w-3 text-[#F27124]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-[#F27124]">
            Management system
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 italic">
          {icon || <BookOpen className="h-8 w-8 text-[#F27124]" />}
          {title}
        </h2>
        <p className="text-slate-400 font-bold text-sm max-w-md leading-relaxed">
          {description}
        </p>
      </div>

      {/* --- RIGHT: FILTERS (BENTO STYLE) --- */}
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-reveal">
        {/* SEMESTER SELECTOR */}
        <div className="w-full sm:w-[200px] group">
          <Select value={selectedSemester} onValueChange={onSemesterChange}>
            <SelectTrigger className="h-14 bg-white border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 focus:ring-2 focus:ring-[#F27124]/20 transition-all duration-300 hover:border-[#F27124]/30">
              <div className="flex items-center gap-3 text-slate-600 font-bold text-[11px] tracking-wider">
                <Calendar className="h-4 w-4 text-[#F27124]" />
                <SelectValue placeholder="Chọn học kỳ" />
              </div>
            </SelectTrigger>
            <SelectContent className="font-mono rounded-2xl border-slate-100 shadow-2xl">
              <SelectItem value="all" className="text-xs font-bold">
                Tất cả các kỳ
              </SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem} className="text-xs font-bold">
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SEARCH INPUT (EXPANDABLE EFFECT) */}
        <div className="relative group w-full md:w-80">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#F27124] transition-colors" />
          </div>
          <Input
            placeholder="Tìm lớp hoặc môn học..."
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-2xl shadow-slate-200/50 focus-visible:ring-2 focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124] transition-all duration-500 text-xs font-bold placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {/* Decorative small element */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[8px] font-black text-slate-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
            ESC
          </div>
        </div>
      </div>
    </div>
  );
}
