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
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-slate-500">
        Đang tải danh sách lớp học...
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
          <Search className="h-8 w-8 text-gray-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          Không tìm thấy lớp học
        </h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
        </p>
        <Button
          variant="link"
          className="mt-2 text-[#F27124] font-bold"
          onClick={onClearFilters}
        >
          Xóa tất cả bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-4">
        <p className="text-sm text-muted-foreground">
          Hiển thị {classes.length} kết quả
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#F27124] text-white border-[#F27124] hover:bg-orange-600 hover:text-white"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Tiếp
          </Button>
        </div>
      </div>
    </div>
  );
}
