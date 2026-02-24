"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Class } from "@/features/management/classes/types/class-types";
import { ClassCard } from "./class-card";

interface ClassListProps {
  classes: Class[];
  isLoading: boolean;
  onEditClass: (cls: Class) => void;
  onViewClassDetails: (cls: Class) => void;
  onClearFilters: () => void;
}

export function ClassList({
  classes,
  isLoading,
  onEditClass,
  onViewClassDetails,
  onClearFilters,
}: ClassListProps) {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium">
        Đang tải danh sách lớp học...
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-800">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
          <Search className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Không tìm thấy lớp học
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={onClearFilters}
        >
          Xóa tất cả bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((cls) => (
          <ClassCard
            key={cls._id}
            cls={cls}
            onEdit={onEditClass}
            onViewDetails={onViewClassDetails}
          />
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Hiển thị{" "}
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {classes.length}
          </span>{" "}
          kết quả
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="rounded-lg border-slate-200 dark:border-slate-800 dark:text-slate-400"
          >
            Trước
          </Button>
          <Button
            variant="default"
            size="sm"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Tiếp
          </Button>
        </div>
      </div>
    </div>
  );
}
