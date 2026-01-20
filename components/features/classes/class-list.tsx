"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ClassItem } from "./class-types";
import { ClassCard } from "./class-card";

interface ClassListProps {
  classes: ClassItem[];
  onSelectClass: (cls: ClassItem) => void;
  onEditClass: (cls: ClassItem) => void;
  onClearFilters: () => void;
}

export function ClassList({
  classes,
  onSelectClass,
  onEditClass,
  onClearFilters,
}: ClassListProps) {
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Không tìm thấy lớp học
        </h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
        </p>
        <Button
          variant="link"
          className="mt-2 text-[#F27124]"
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
            key={cls.id}
            cls={cls}
            onClick={() => onSelectClass(cls)}
            onEdit={onEditClass}
          />
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-sm text-muted-foreground">
          Hiển thị {classes.length} kết quả
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#F27124] text-white border-[#F27124] hover:bg-[#d65d1b] hover:text-white"
          >
            1
          </Button>
          <Button variant="ghost" size="sm">
            2
          </Button>
          <Button variant="ghost" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Tiếp
          </Button>
        </div>
      </div>
    </div>
  );
}
