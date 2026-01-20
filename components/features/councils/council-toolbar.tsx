"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Filter, Plus, Search } from "lucide-react";

interface CouncilToolbarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onCreate: () => void;
}

export function CouncilToolbar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCreate,
}: CouncilToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
      <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
          <Input
            placeholder="Tìm tên hội đồng, phòng..."
            className="pl-10 bg-gray-50/50 focus:bg-white border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] rounded-xl bg-gray-50/50 border-gray-200 focus:ring-[#F27124]/20 focus:border-[#F27124]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <SelectValue placeholder="Trạng thái" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả</SelectItem>
            <SelectItem value="Upcoming">Sắp diễn ra</SelectItem>
            <SelectItem value="Completed">Đã xong</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="bg-[#F27124] hover:bg-[#d65d1b] shadow-md shadow-orange-500/20 rounded-xl"
        onClick={onCreate}
      >
        <Plus className="mr-2 h-4 w-4" /> Tạo Hội đồng
      </Button>
    </div>
  );
}
