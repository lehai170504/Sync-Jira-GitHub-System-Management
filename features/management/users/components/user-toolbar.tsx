"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, User, Activity, X, RotateCcw } from "lucide-react";

interface UserToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onResetFilters?: () => void;
}

export function UserToolbar({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onResetFilters,
}: UserToolbarProps) {
  const isFiltered =
    searchTerm !== "" || roleFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center p-1">
      {/* --- LEFT: SEARCH BAR --- */}
      <div className="relative w-full lg:w-96 group transition-all duration-200 ease-in-out">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
        <Input
          placeholder="Tìm kiếm Tên, Email, MSSV..."
          className="pl-10 pr-10 h-11 bg-white border-gray-200 focus:border-[#F27124] focus:ring-2 focus:ring-[#F27124]/10 rounded-xl shadow-sm hover:border-[#F27124]/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
        {/* Filter Group Wrapper */}
        <div className="flex flex-1 sm:flex-none gap-3 w-full sm:w-auto">
          {/* 1. Filter Role (CHỈ CÒN GIẢNG VIÊN & SINH VIÊN) */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger
              className={`h-11 w-full sm:w-[160px] rounded-xl border transition-all duration-200 ${
                roleFilter !== "all"
                  ? "bg-orange-50 border-orange-200 text-orange-700 font-medium"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <User
                  className={`h-4 w-4 ${roleFilter !== "all" ? "text-orange-600" : "text-gray-400"}`}
                />
                <SelectValue placeholder="Vai trò" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả Vai trò</SelectItem>
              <SelectItem value="LECTURER">Giảng viên</SelectItem>
              <SelectItem value="STUDENT">Sinh viên</SelectItem>
            </SelectContent>
          </Select>

          {/* 2. Filter Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className={`h-11 w-full sm:w-[160px] rounded-xl border transition-all duration-200 ${
                statusFilter !== "all"
                  ? "bg-orange-50 border-orange-200 text-orange-700 font-medium"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Activity
                  className={`h-4 w-4 ${statusFilter !== "all" ? "text-orange-600" : "text-gray-400"}`}
                />
                <SelectValue placeholder="Trạng thái" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả Trạng thái</SelectItem>
              <SelectItem value="Active">Đang hoạt động</SelectItem>
              <SelectItem value="Reserved">Bảo lưu</SelectItem>
              <SelectItem value="Dropped">Thôi học</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        {isFiltered && onResetFilters && (
          <>
            <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />
            <Button
              variant="ghost"
              onClick={onResetFilters}
              className="h-11 w-full sm:w-auto px-4 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
