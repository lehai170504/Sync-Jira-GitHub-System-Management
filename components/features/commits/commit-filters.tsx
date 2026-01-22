"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface CommitFiltersProps {
  authorFilter: string;
  fromDate: string;
  toDate: string;
  authors: string[];
  onAuthorChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
  isLeader?: boolean;
  currentUserAuthorName?: string;
}

export function CommitFilters({
  authorFilter,
  fromDate,
  toDate,
  authors,
  onAuthorChange,
  onFromDateChange,
  onToDateChange,
  onReset,
  isLeader = true,
  currentUserAuthorName = "",
}: CommitFiltersProps) {
  const hasActiveFilters = (isLeader && authorFilter !== "ALL") || fromDate || toDate;

  return (
    <Card className="border-2 shadow-lg bg-gradient-to-br from-white to-purple-50/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Filter className="h-4 w-4 text-purple-600" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Lọc commit
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Author filter - chỉ hiển thị cho LEADER */}
          {isLeader ? (
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-foreground">Thành viên</label>
              <Select value={authorFilter} onValueChange={onAuthorChange}>
                <SelectTrigger className="w-full md:w-[240px] border-2">
                  <SelectValue placeholder="Chọn thành viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả thành viên</SelectItem>
                  {authors.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-foreground">Thành viên</label>
              <div className="px-3 py-2 bg-muted rounded-md border-2 border-purple-200 text-sm text-muted-foreground">
                {currentUserAuthorName || "Bạn"}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Từ ngày</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full md:w-[200px] border-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Đến ngày</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full md:w-[200px] border-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onReset}
              disabled={!hasActiveFilters}
              className="border-2 hover:bg-purple-50"
            >
              <X className="h-4 w-4 mr-2" />
              Xóa lọc
            </Button>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-md">
            <Filter className="h-3 w-3" />
            <span>Đang áp dụng bộ lọc</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

