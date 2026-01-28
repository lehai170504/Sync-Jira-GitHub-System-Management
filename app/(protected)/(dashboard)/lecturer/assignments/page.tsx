"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Search, Filter, Loader2, FileSearch, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hooks & Components
import { useClassAssignments } from "@/features/lecturer/hooks/use-assignments";
import { CreateAssignmentDialog } from "@/features/lecturer/components/assignments/create-assignment-dialog";
import { AssignmentCard } from "@/features/lecturer/components/assignments/assignment-card";

export default function AssignmentsPage() {
  const classId = Cookies.get("lecturer_class_id");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Fetch Data từ API
  const { data: assignments = [], isLoading } = useClassAssignments(
    classId,
    filterType,
  );

  // Client-side search
  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-20 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F27124] mb-1">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Class Activities
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
            Bài tập & Đánh giá
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Quản lý các bài tập (Assignment) và bài thực hành (Lab).
          </p>
        </div>

        {/* Nút tạo mới */}
        <CreateAssignmentDialog classId={classId} />
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm kiếm theo tên bài tập..."
            className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-[#F27124]/50 focus:ring-4 focus:ring-[#F27124]/10 rounded-xl text-base transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Select */}
        <Select onValueChange={setFilterType} defaultValue="all">
          <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-colors focus:ring-4 focus:ring-slate-100">
            <div className="flex items-center gap-2.5 text-slate-600 font-medium">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder="Tất cả loại" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
            <SelectItem value="all" className="rounded-lg py-2 cursor-pointer">
              Tất cả bài tập
            </SelectItem>
            <SelectItem
              value="ASSIGNMENT"
              className="rounded-lg py-2 cursor-pointer"
            >
              Assignment
            </SelectItem>
            <SelectItem value="LAB" className="rounded-lg py-2 cursor-pointer">
              Lab (Thực hành)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <div className="p-4 bg-white rounded-full shadow-lg shadow-orange-100/50 border border-orange-50">
              <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
            </div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <AssignmentCard key={item._id} assignment={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <FileSearch className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Không tìm thấy bài tập nào
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Không có kết quả nào khớp với từ khóa{" "}
              <strong>"{searchTerm}"</strong> hoặc bộ lọc hiện tại.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
