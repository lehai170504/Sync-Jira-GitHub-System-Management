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
  Upload,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

// Import Component Dialog & Hooks
import { ClassDialog } from "./class-dialog"; // Import đúng component đã tạo
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";

interface ClassToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  semesterFilter: string;
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

  // Lấy danh sách Học kỳ cho Filter
  const { data: semesters } = useSemesters();

  const handleImport = async () => {
    setIsImporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Đã nhập danh sách lớp thành công từ Excel!");
    setIsImporting(false);
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
            className="pl-10 bg-gray-50/50 focus:bg-white border-gray-200 focus:border-[#F27124] rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ACTIONS GROUP */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
          {/* FILTER SEMESTER */}
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-[180px] h-10 rounded-xl bg-white border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Chọn học kỳ" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả học kỳ</SelectItem>
              {semesters?.map((sem) => (
                <SelectItem key={sem._id} value={sem._id}>
                  {sem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* IMPORT BUTTON */}
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

          {/* CREATE BUTTON */}
          <Button
            className="h-10 rounded-xl bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/20"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Tạo lớp</span>
          </Button>
        </div>
      </div>

      {/* Dialog Tạo Mới */}
      <ClassDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
