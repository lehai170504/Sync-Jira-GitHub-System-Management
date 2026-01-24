"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Filter,
  Plus,
  Search,
  Upload,
  Loader2,
  X,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

// Import Component Dialog & Hooks
import { ClassDialog } from "./class-dialog";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";

interface ClassToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  semesterFilter: string | undefined;
  setSemesterFilter: (value: string) => void;
  clearFilters: () => void;
}

export function ClassToolbar({
  searchTerm,
  setSearchTerm,
  semesterFilter,
  setSemesterFilter,
  clearFilters,
}: ClassToolbarProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Lấy danh sách Học kỳ
  const { data: semesters } = useSemesters();

  const handleImport = async () => {
    setIsImporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Đã nhập danh sách lớp thành công từ Excel!");
    setIsImporting(false);
  };

  // Kiểm tra trạng thái lọc
  const isFiltered =
    searchTerm !== "" || (semesterFilter && semesterFilter !== "all");

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center p-1">
      {/* --- LEFT: SEARCH BAR --- */}
      <div className="relative w-full lg:w-96 group transition-all duration-200 ease-in-out">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
        <Input
          placeholder="Tìm mã lớp, giảng viên..."
          className="pl-10 pr-10 h-11 bg-white border-gray-200 focus:border-[#F27124] focus:ring-2 focus:ring-[#F27124]/10 rounded-xl shadow-sm hover:border-[#F27124]/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Nút X xóa search text */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* --- RIGHT: FILTERS & ACTIONS --- */}
      <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 items-center">
        {/* 1. FILTER SEMESTER */}
        <Select
          value={semesterFilter || "all"}
          onValueChange={(val) => setSemesterFilter(val === "all" ? "" : val)}
        >
          <SelectTrigger
            className={`h-11 w-full sm:w-[180px] rounded-xl border transition-all duration-200 ${
              semesterFilter && semesterFilter !== "all"
                ? "bg-orange-50 border-orange-200 text-orange-700 font-medium"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Calendar
                className={`h-4 w-4 ${
                  semesterFilter && semesterFilter !== "all"
                    ? "text-orange-600"
                    : "text-gray-400"
                }`}
              />
              <SelectValue placeholder="Học kỳ" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả học kỳ</SelectItem>
            {semesters?.map((sem) => (
              <SelectItem key={sem._id} value={sem._id}>
                {sem.name} ({sem.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Nút Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-11 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        )}

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

        {/* 2. IMPORT BUTTON */}
        <Button
          variant="outline"
          className="h-11 w-full sm:w-auto rounded-xl bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
          onClick={handleImport}
          disabled={isImporting}
        >
          {isImporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          <span className="hidden sm:inline">Import</span>
        </Button>

        {/* 3. CREATE BUTTON */}
        <Button
          className="h-11 w-full sm:w-auto rounded-xl bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/20 font-medium transition-all active:scale-95"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Tạo lớp mới</span>
          <span className="sm:hidden">Tạo</span>
        </Button>
      </div>

      {/* Dialog Tạo Mới */}
      <ClassDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
