"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Filter,
  Plus,
  Search,
  XCircle,
  Upload, // Icon Import
  Loader2, // Icon Loading
} from "lucide-react";
import { toast } from "sonner";
import { CreateClassDialog } from "./create-class-dialog";

interface ClassToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: { subject: string; status: string; semester: string };
  setFilters: (filters: {
    subject: string;
    status: string;
    semester: string;
  }) => void;
  uniqueSubjects: string[];
  uniqueSemesters: string[];
  activeFiltersCount: number;
  clearFilters: () => void;
}

export function ClassToolbar({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  uniqueSubjects,
  uniqueSemesters,
  activeFiltersCount,
  clearFilters,
}: ClassToolbarProps) {
  // State quản lý loading cho các nút hành động
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleUpdateFilter = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  // Giả lập hành động Import
  const handleImport = async () => {
    setIsImporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Đã nhập danh sách lớp thành công từ Excel!");
    setIsImporting(false);
  };

  // Giả lập hành động Export
  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Đã xuất file báo cáo!");
    setIsExporting(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        {/* SEARCH BAR */}
        <div className="relative w-full xl:w-96 group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm mã lớp, giảng viên..."
            className="pl-10 bg-gray-50/50 focus:bg-white border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ACTIONS GROUP */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
          {/* 1. FILTER BUTTON */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 px-4 rounded-xl border-gray-200 hover:bg-gray-50 ${
                  activeFiltersCount > 0
                    ? "border-[#F27124] text-[#F27124] bg-orange-50"
                    : ""
                }`}
              >
                <Filter className="mr-2 h-4 w-4" /> Bộ lọc
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-[#F27124] text-white hover:bg-[#d65d1b] h-5 px-1.5"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 rounded-xl shadow-xl"
              align="end"
            >
              {/* ... (Giữ nguyên nội dung Filter Content như cũ) ... */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold leading-none">
                    Bộ lọc nâng cao
                  </h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-red-500"
                      onClick={clearFilters}
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Môn học</Label>
                  <Select
                    value={filters.subject}
                    onValueChange={(val) => handleUpdateFilter("subject", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả môn</SelectItem>
                      {uniqueSubjects.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(val) => handleUpdateFilter("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Active">Đang hoạt động</SelectItem>
                      <SelectItem value="Finished">Đã kết thúc</SelectItem>
                      <SelectItem value="Upcoming">Sắp tới</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Học kỳ</Label>
                  <Select
                    value={filters.semester}
                    onValueChange={(val) => handleUpdateFilter("semester", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn học kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {uniqueSemesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* 2. IMPORT BUTTON (QUAN TRỌNG) */}
          <Button
            variant="outline"
            className="h-10 rounded-xl bg-white hover:bg-gray-50 border-gray-200"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            <span className="hidden sm:inline">Import Excel</span>
          </Button>

          {/* 3. EXPORT BUTTON */}
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            <span className="hidden sm:inline">Xuất</span>
          </Button>

          {/* 4. CREATE MANUAL (Dành cho Admin fix lỗi) */}
          <Button
            className="h-10 rounded-xl bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/20"
            onClick={() => setIsCreateOpen(true)} // Mở Dialog khi click
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Tạo lớp</span>
          </Button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-2">
            Đang lọc theo:
          </span>
          {filters.subject !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 bg-white border border-gray-200 py-1"
            >
              Môn: {filters.subject}{" "}
              <XCircle
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => handleUpdateFilter("subject", "all")}
              />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 bg-white border border-gray-200 py-1"
            >
              TT: {filters.status}{" "}
              <XCircle
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => handleUpdateFilter("status", "all")}
              />
            </Badge>
          )}
          {filters.semester !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 bg-white border border-gray-200 py-1"
            >
              Kỳ: {filters.semester}{" "}
              <XCircle
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => handleUpdateFilter("semester", "all")}
              />
            </Badge>
          )}
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground h-auto p-0 ml-2"
            onClick={clearFilters}
          >
            Xóa hết
          </Button>
        </div>
      )}
      <CreateClassDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          // Có thể gọi props.refreshData() nếu có
          console.log("Class created, refreshing list...");
        }}
      />
    </div>
  );
}
