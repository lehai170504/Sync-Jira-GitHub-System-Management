"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  Search,
  Filter,
  Loader2,
  FileSearch,
  LayoutGrid,
  FilePlus2,
  FilterX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useClassAssignments } from "@/features/lecturer/hooks/use-assignments";
import { CreateAssignmentDialog } from "@/features/lecturer/components/assignments/create-assignment-dialog";
import { AssignmentCard } from "@/features/lecturer/components/assignments/assignment-card";

export default function AssignmentsPage() {
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("classId");

  const cookieClassId =
    typeof window !== "undefined"
      ? Cookies.get("lecturer_class_id")
      : undefined;

  const classId = urlClassId || cookieClassId;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: assignments = [], isLoading } = useClassAssignments(
    classId,
    filterType,
  );

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- LOADING STATE KHI CHƯA CÓ CLASS ID ---
  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500 dark:text-slate-400 animate-in fade-in duration-500 font-sans transition-colors">
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-full mb-6 border border-slate-200 dark:border-slate-800">
          <FilePlus2 className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Chưa xác định lớp học
        </h2>
        <p className="font-medium text-sm text-slate-500 dark:text-slate-400">
          Vui lòng chọn lớp học từ danh sách để quản lý bài tập.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-20 font-sans max-w-400 mx-auto p-4 md:p-8 transition-colors duration-300">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutGrid className="h-4 w-4" />
            Class Activities
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            Bài tập & Đánh giá
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base">
            Quản lý các bài tập (Assignment) và bài thực hành (Lab) của lớp học.
          </p>
        </div>

        {/* Nút tạo mới */}
        <CreateAssignmentDialog classId={classId} />
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="sticky top-4 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center transition-colors">
        {/* Search Input */}
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Tìm kiếm theo tên bài tập..."
            className="w-full pl-12 pr-6 h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-800 dark:text-slate-100 font-medium transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Select */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <Select onValueChange={setFilterType} value={filterType}>
            <SelectTrigger className="w-full md:w-45 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <SelectValue placeholder="Tất cả loại" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
              <SelectItem
                value="all"
                className="rounded-lg py-2.5 font-medium cursor-pointer dark:text-slate-200"
              >
                Tất cả bài tập
              </SelectItem>
              <SelectItem
                value="ASSIGNMENT"
                className="rounded-lg py-2.5 font-medium cursor-pointer dark:text-slate-200"
              >
                Assignment
              </SelectItem>
              <SelectItem
                value="LAB"
                className="rounded-lg py-2.5 font-medium cursor-pointer dark:text-slate-200"
              >
                Lab (Thực hành)
              </SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || filterType !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors h-12 px-4"
            >
              <FilterX className="w-4 h-4 mr-2" /> Xóa lọc
            </Button>
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="min-h-100">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
              Đang tải danh sách bài tập...
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
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/30 transition-colors">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 shadow-sm border border-slate-100 dark:border-slate-700">
              <FileSearch className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
              Không tìm thấy bài tập nào
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
              Không có kết quả nào khớp với bộ lọc hiện tại của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
