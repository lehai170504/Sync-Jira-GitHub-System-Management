"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, RotateCcw } from "lucide-react";

interface ManagementToolbarProps {
  // 1. Props cho ô tìm kiếm
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  searchPlaceholder?: string;

  filterContent?: ReactNode;
  actionContent?: ReactNode;

  // 3. Xử lý Reset bộ lọc
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function ManagementToolbar({
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Tìm kiếm...",
  filterContent,
  actionContent,
  onResetFilters,
  hasActiveFilters,
}: ManagementToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center p-1">
      {/* --- PHẦN BÊN TRÁI: THANH TÌM KIẾM --- */}
      {/* Chỉ hiển thị nếu component cha truyền hàm setSearchTerm xuống */}
      {setSearchTerm && (
        <div className="relative w-full lg:w-96 group transition-all duration-200 ease-in-out">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-10 pr-10 h-11 bg-white border-gray-200 focus:border-[#F27124] focus:ring-2 focus:ring-[#F27124]/10 rounded-xl shadow-sm hover:border-[#F27124]/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Nút X nhỏ để xóa nhanh từ khóa tìm kiếm */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* --- PHẦN BÊN PHẢI: BỘ LỌC VÀ NÚT BẤM --- */}
      <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 items-center justify-end flex-1">
        {/* Khu vực chứa các Select (Filter) */}
        {filterContent && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {filterContent}
          </div>
        )}

        {/* Nút Đặt lại (Reset Filters) - Chỉ hiện khi đang lọc */}
        {hasActiveFilters && onResetFilters && (
          <>
            <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />
            <Button
              variant="ghost"
              onClick={onResetFilters}
              className="h-11 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors font-medium whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
          </>
        )}

        {/* Đường gạch phân cách giữa Filter và Action Buttons */}
        {actionContent && filterContent && (
          <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />
        )}

        {/* Khu vực chứa nút Import, Create... */}
        {actionContent && (
          <div className="flex flex-row gap-3 w-full sm:w-auto">
            {actionContent}
          </div>
        )}
      </div>
    </div>
  );
}
