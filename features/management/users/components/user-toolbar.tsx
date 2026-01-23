"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Thêm Button
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, UserCheck, X } from "lucide-react"; // Thêm Icon X

interface UserToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  // Thêm prop để reset
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
  // Kiểm tra xem có đang lọc gì không
  const isFiltered =
    searchTerm !== "" || roleFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between p-4 bg-white border rounded-xl shadow-sm transition-all">
      {/* Search Bar */}
      <div className="relative w-full lg:w-96 group">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
        <Input
          placeholder="Tìm kiếm theo Tên, Email, MSSV..."
          className="pl-10 bg-gray-50/50 focus:bg-white border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters Group */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
        {/* 1. Filter Role */}
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger
            className={`w-full sm:w-[180px] border-gray-200 rounded-xl focus:ring-[#F27124]/20 focus:border-[#F27124] ${roleFilter !== "all" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white"}`}
          >
            <div className="flex items-center gap-2">
              <Filter
                className={`h-3.5 w-3.5 ${roleFilter !== "all" ? "text-orange-600" : "text-muted-foreground"}`}
              />
              <span
                className={
                  roleFilter !== "all" ? "font-medium" : "text-gray-700"
                }
              >
                <SelectValue placeholder="Vai trò" />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Vai trò</SelectItem>
            <SelectItem value="ADMIN">Quản trị viên (Admin)</SelectItem>
            <SelectItem value="LECTURER">Giảng viên (Lecturer)</SelectItem>
            <SelectItem value="STUDENT">Sinh viên (Student)</SelectItem>
          </SelectContent>
        </Select>

        {/* 2. Filter Status */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className={`w-full sm:w-[180px] border-gray-200 rounded-xl focus:ring-[#F27124]/20 focus:border-[#F27124] ${statusFilter !== "all" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white"}`}
          >
            <div className="flex items-center gap-2">
              <UserCheck
                className={`h-3.5 w-3.5 ${statusFilter !== "all" ? "text-orange-600" : "text-muted-foreground"}`}
              />
              <span
                className={
                  statusFilter !== "all" ? "font-medium" : "text-gray-700"
                }
              >
                <SelectValue placeholder="Trạng thái" />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Trạng thái</SelectItem>
            <SelectItem value="Active">Đang hoạt động</SelectItem>
            <SelectItem value="Reserved">Bảo lưu</SelectItem>
            <SelectItem value="Dropped">Thôi học</SelectItem>
          </SelectContent>
        </Select>

        {/* 3. Button Reset (Chỉ hiện khi có filter) */}
        {isFiltered && onResetFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="h-10 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
          >
            <X className="h-4 w-4 mr-2" />
            Xóa lọc
          </Button>
        )}
      </div>
    </div>
  );
}
