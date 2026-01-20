"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface TopicToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  majorFilter: string;
  setMajorFilter: (value: string) => void;
}

export function TopicToolbar({
  searchTerm,
  setSearchTerm,
  majorFilter,
  setMajorFilter,
}: TopicToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
      <div className="relative w-full sm:w-96 group">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
        <Input
          placeholder="Tìm tên đề tài, nhóm, mentor..."
          className="pl-10 bg-gray-50/50 focus:bg-white border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={majorFilter} onValueChange={setMajorFilter}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-xl bg-gray-50/50 border-gray-200 focus:ring-[#F27124]/20 focus:border-[#F27124]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <SelectValue placeholder="Chuyên ngành" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả chuyên ngành</SelectItem>
            <SelectItem value="Software Engineering">
              Kỹ thuật phần mềm
            </SelectItem>
            <SelectItem value="AI">Trí tuệ nhân tạo (AI)</SelectItem>
            <SelectItem value="Information Assurance">
              An toàn thông tin
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
