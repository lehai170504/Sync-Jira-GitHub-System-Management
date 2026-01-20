"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export function AnalyticsToolbar() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 p-2 rounded-xl border border-gray-100 mb-6">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-2">
        <Filter className="h-4 w-4" /> Bộ lọc:
      </div>

      <Select defaultValue="sprint4">
        <SelectTrigger className="w-full sm:w-[200px] h-9 bg-white border-gray-200 focus:ring-[#F27124]/20 focus:border-[#F27124] rounded-lg">
          <SelectValue placeholder="Chọn Sprint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sprint4">Sprint 4 (Current)</SelectItem>
          <SelectItem value="sprint3">Sprint 3</SelectItem>
          <SelectItem value="sprint2">Sprint 2</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[200px] h-9 bg-white border-gray-200 focus:ring-[#F27124]/20 focus:border-[#F27124] rounded-lg">
          <SelectValue placeholder="Thành viên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả thành viên</SelectItem>
          <SelectItem value="fe">Front-end Team</SelectItem>
          <SelectItem value="be">Back-end Team</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
