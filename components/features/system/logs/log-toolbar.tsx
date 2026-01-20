"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Download,
  Filter,
  RefreshCcw,
  Search,
  Loader2, // 1. Import Loader2
} from "lucide-react";
import { toast } from "sonner";

interface LogToolbarProps {
  onSearch: (value: string) => void;
  onFilter: (value: string) => void;
}

export function LogToolbar({ onSearch, onFilter }: LogToolbarProps) {
  // 2. Thêm state để quản lý loading riêng cho từng nút
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Hàm giả lập Refresh dữ liệu
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Giả lập delay 1 giây
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.info("Đã làm mới dữ liệu hệ thống");
    setIsRefreshing(false);
  };

  // Hàm giả lập Xuất Excel
  const handleExport = async () => {
    setIsExporting(true);
    // Giả lập delay 2 giây
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Đã xuất file báo cáo thành công!");
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
      {/* Left Side: Search & Filter */}
      <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo User, Action..."
            className="pl-9 h-10 bg-gray-50/50 focus:bg-white transition-all focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Select onValueChange={onFilter} defaultValue="All">
          <SelectTrigger className="w-[140px] h-10 focus:ring-[#F27124]/20 focus:border-[#F27124]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Trạng thái" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả</SelectItem>
            <SelectItem value="Success">Thành công</SelectItem>
            <SelectItem value="Warning">Cảnh báo</SelectItem>
            <SelectItem value="Error">Lỗi nghiêm trọng</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="h-10 gap-2 text-muted-foreground hidden sm:flex"
        >
          <CalendarDays className="h-4 w-4" />
          <span>Hôm nay</span>
        </Button>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {/* Nút Refresh */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>

        <Button
          className="h-10 bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-sm gap-2 min-w-[140px]" // Thêm min-w để nút không bị co giãn
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xuất...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
