"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Upload, Loader2, User } from "lucide-react";
import { toast } from "sonner";

import { ManagementToolbar } from "@/components/common/management-toolbar";
import { ClassDialog } from "./class-dialog";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { useUsers } from "@/features/management/users/hooks/use-users";

interface ClassToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  semesterFilter: string | undefined;
  setSemesterFilter: (value: string) => void;
  lecturerFilter: string | undefined;
  setLecturerFilter: (value: string) => void;
  clearFilters: () => void;
}

export function ClassToolbar({
  searchTerm,
  setSearchTerm,
  semesterFilter,
  setSemesterFilter,
  lecturerFilter,
  setLecturerFilter,
  clearFilters,
}: ClassToolbarProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: semesters } = useSemesters();
  const { data: lecturersData } = useUsers({ role: "LECTURER", limit: 100 });
  const lecturers = lecturersData?.users || [];

  const handleImport = async () => {
    setIsImporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Đã nhập danh sách lớp thành công từ Excel!");
    setIsImporting(false);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    (!!semesterFilter && semesterFilter !== "all") ||
    (!!lecturerFilter && lecturerFilter !== "all");

  return (
    <>
      <ManagementToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Tìm mã lớp, tên môn..."
        hasActiveFilters={hasActiveFilters}
        onResetFilters={clearFilters}
        filterContent={
          <>
            {/* 1. Filter Học kỳ */}
            <Select
              value={semesterFilter || "all"}
              onValueChange={(val) =>
                setSemesterFilter(val === "all" ? "" : val)
              }
            >
              <SelectTrigger
                className={`h-11 w-full sm:w-[160px] rounded-xl border transition-all duration-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 ${
                  semesterFilter && semesterFilter !== "all"
                    ? "bg-orange-50 border-orange-200 text-orange-700 font-medium dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Calendar
                    className={`h-4 w-4 ${
                      semesterFilter && semesterFilter !== "all"
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-400 dark:text-slate-500"
                    }`}
                  />
                  <SelectValue placeholder="Học kỳ" />
                </div>
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                {semesters?.map((sem) => (
                  <SelectItem key={sem._id} value={sem._id}>
                    {sem.name} ({sem.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 2. Filter Giảng viên */}
            <Select
              value={lecturerFilter || "all"}
              onValueChange={(val) =>
                setLecturerFilter(val === "all" ? "" : val)
              }
            >
              <SelectTrigger
                className={`h-11 w-full sm:w-[180px] rounded-xl border transition-all duration-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 ${
                  lecturerFilter && lecturerFilter !== "all"
                    ? "bg-orange-50 border-orange-200 text-orange-700 font-medium dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <User
                    className={`h-4 w-4 ${
                      lecturerFilter && lecturerFilter !== "all"
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-400 dark:text-slate-500"
                    }`}
                  />
                  <SelectValue placeholder="Giảng viên" />
                </div>
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                <SelectItem value="all">Tất cả giảng viên</SelectItem>
                {lecturers.map((lec) => (
                  <SelectItem key={lec._id} value={lec._id}>
                    {lec.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        actionContent={
          <>
            <Button
              variant="outline"
              className="h-11 w-full sm:w-auto rounded-xl bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300"
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

            <Button
              className="h-11 w-full sm:w-auto rounded-xl bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/20 font-medium transition-all active:scale-95"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Tạo lớp mới</span>
              <span className="sm:hidden">Tạo</span>
            </Button>
          </>
        }
      />

      <ClassDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
