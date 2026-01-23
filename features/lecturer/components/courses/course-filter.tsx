"use client";

import { Search, Calendar, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseFilterProps {
  semesters: string[];
  selectedSemester: string;
  onSemesterChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CourseFilter({
  semesters,
  selectedSemester,
  onSemesterChange,
  searchTerm,
  onSearchChange,
}: CourseFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-[#F27124]" /> Các lớp giảng dạy
        </h2>
        <p className="text-gray-500 mt-2 text-lg">
          Chọn lớp học để bắt đầu quản lý và chấm điểm.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* SEMESTER SELECTOR */}
        <div className="w-full sm:w-[180px]">
          <Select value={selectedSemester} onValueChange={onSemesterChange}>
            <SelectTrigger className="h-11 bg-orange-100 border-orange-200 shadow-sm rounded-lg focus:ring-2 focus:ring-[#F27124]/20">
              <div className="flex items-center gap-2 text-orange-700">
                <Calendar className="h-4 w-4 text-orange-500" />
                <SelectValue placeholder="Chọn học kỳ" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả các kỳ</SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SEARCH INPUT */}
        <div className="flex items-center gap-2 bg-white px-3 h-11 rounded-lg border border-gray-200 shadow-sm w-full md:w-80 focus-within:ring-2 focus-within:ring-[#F27124]/20 focus-within:border-[#F27124] transition-all">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <Input
            placeholder="Tìm lớp hoặc môn học..."
            className="border-0 focus-visible:ring-0 h-full p-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
