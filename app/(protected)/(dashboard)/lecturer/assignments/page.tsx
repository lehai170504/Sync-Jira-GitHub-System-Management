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
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 dark:text-slate-400 animate-in fade-in duration-500">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full mb-6 border border-slate-100 dark:border-slate-800">
          <FilePlus2 className="w-16 h-16 text-slate-200 dark:text-slate-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
          Chưa xác định lớp học
        </h2>
        <p className="font-medium text-sm text-slate-400 dark:text-slate-500">
          Vui lòng chọn lớp học từ danh sách để quản lý bài tập.
        </p>
      </div>
    );
  }

  return (
    // THÊM: dark:text-slate-100 để set màu chữ mặc định cho toàn trang
    <div className="space-y-8 animate-in fade-in-50 pb-20 font-sans max-w-[1440px] mx-auto p-4 md:p-8 dark:text-slate-100">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-8 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F27124] dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-100 dark:border-orange-500/20 mb-2">
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Class Activities
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-50 leading-tight">
            Bài tập & Đánh giá
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg">
            Quản lý các bài tập (Assignment) và bài thực hành (Lab) của lớp học.
          </p>
        </div>

        {/* Nút tạo mới */}
        <CreateAssignmentDialog classId={classId} />
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="sticky top-4 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none flex flex-col md:flex-row gap-3 items-center transition-colors">
        {/* Search Input */}
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm kiếm theo tên bài tập..."
            className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-[#F27124]/50 dark:focus:border-[#F27124]/50 focus:ring-4 focus:ring-[#F27124]/10 rounded-xl text-base transition-all w-full dark:text-slate-100 dark:placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Select */}
        <div className="w-full md:w-auto">
          <Select onValueChange={setFilterType} defaultValue="all">
            <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/50">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium">
                <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <SelectValue placeholder="Tất cả loại" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl dark:bg-slate-900">
              <SelectItem
                value="all"
                className="rounded-lg py-2 cursor-pointer dark:text-slate-200"
              >
                Tất cả bài tập
              </SelectItem>
              <SelectItem
                value="ASSIGNMENT"
                className="rounded-lg py-2 cursor-pointer dark:text-slate-200"
              >
                Assignment
              </SelectItem>
              <SelectItem
                value="LAB"
                className="rounded-lg py-2 cursor-pointer dark:text-slate-200"
              >
                Lab (Thực hành)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-lg shadow-orange-100/50 dark:shadow-none border border-orange-50 dark:border-slate-800">
              <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium animate-pulse">
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
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] bg-slate-50/30 dark:bg-slate-900/30">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <FileSearch className="h-10 w-10 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-2">
              Không tìm thấy bài tập nào
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Không có kết quả nào khớp với từ khóa{" "}
              <strong className="dark:text-slate-300">"{searchTerm}"</strong>{" "}
              hoặc bộ lọc hiện tại.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                variant="outline"
                className="px-6 py-2 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-bold"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
