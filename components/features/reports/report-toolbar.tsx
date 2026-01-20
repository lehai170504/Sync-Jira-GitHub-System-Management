"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ReportToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export function ReportToolbar({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
}: ReportToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
      <div className="relative w-full sm:w-80 group">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        <Input
          placeholder="Tìm tên báo cáo..."
          className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-full sm:w-[180px] rounded-xl bg-white border-gray-200">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <SelectValue placeholder="Loại file" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">Tất cả định dạng</SelectItem>
          <SelectItem value="PDF">PDF Document</SelectItem>
          <SelectItem value="Excel">Excel Spreadsheet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
