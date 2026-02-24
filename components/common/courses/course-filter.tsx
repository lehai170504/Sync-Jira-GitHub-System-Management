"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List } from "lucide-react";
import { ReactNode } from "react";

interface CourseFilterProps {
  title: string;
  description: string;
  icon: ReactNode;
  semesters: string[];
  selectedSemester: string;
  onSemesterChange: (val: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export function CourseFilter({
  title,
  description,
  icon,
  semesters,
  selectedSemester,
  onSemesterChange,
  searchTerm,
  onSearchChange,
  viewMode = "grid",
  onViewModeChange,
}: CourseFilterProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 transition-colors">
          {icon}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight transition-colors">
            {title}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full xl:w-auto items-center gap-4">
        <div className="relative w-full sm:w-[300px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm theo tên lớp, mã môn..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus-visible:ring-[#F27124]/20 transition-colors placeholder:font-medium"
          />
        </div>

        <Select value={selectedSemester} onValueChange={onSemesterChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-[#F27124]/20 transition-colors">
            <SelectValue placeholder="Chọn học kỳ" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <SelectItem value="all" className="dark:text-slate-200 font-medium">
              Tất cả học kỳ
            </SelectItem>
            {semesters.map((sem) => (
              <SelectItem
                key={sem}
                value={sem}
                className="dark:text-slate-200 font-medium"
              >
                {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Nút Toggle View */}
        {onViewModeChange && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className={`w-9 h-9 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              onClick={() => onViewModeChange("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className={`w-9 h-9 rounded-xl transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              onClick={() => onViewModeChange("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
