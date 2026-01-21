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
import { Filter } from "lucide-react";

interface CommitFiltersProps {
  authorFilter: string;
  fromDate: string;
  toDate: string;
  authors: string[];
  onAuthorChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
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
}: CommitFiltersProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Lọc commit
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Thành viên</label>
          <Select value={authorFilter} onValueChange={onAuthorChange}>
            <SelectTrigger className="w-[240px]">
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
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Từ ngày</label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-[200px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Đến ngày</label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-[200px]"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset}>
            Xóa lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

