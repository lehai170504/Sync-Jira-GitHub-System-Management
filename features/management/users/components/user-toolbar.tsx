"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, UserCheck } from "lucide-react";

interface UserToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function UserToolbar({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: UserToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between p-4 bg-white border rounded-xl shadow-sm">
      {/* Search */}
      <div className="relative w-full lg:w-96 group">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
        <Input
          placeholder="Tìm kiếm theo Tên, Email, MSSV..."
          className="pl-10 bg-gray-50/50 focus:bg-white border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 rounded-xl focus:ring-[#F27124]/20 focus:border-[#F27124]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span className="text-gray-700">
                <SelectValue placeholder="Vai trò" />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Vai trò</SelectItem>
            <SelectItem value="LECTURER">Giảng viên</SelectItem>
            <SelectItem value="MEMBER">Sinh viên</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 rounded-xl focus:ring-[#F27124]/20 focus:border-[#F27124]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserCheck className="h-3.5 w-3.5" />
              <span className="text-gray-700">
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
      </div>
    </div>
  );
}
