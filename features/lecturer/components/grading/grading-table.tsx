"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradingTableProps {
  data: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function GradingTable({
  data,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: GradingTableProps) {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-100 py-5 bg-gray-50/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sinh viên, MSSV..."
                className="pl-9 bg-white border-gray-200 rounded-lg focus:border-[#F27124] focus:ring-1 focus:ring-orange-100 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-white border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-gray-500" />
                  <SelectValue placeholder="Trạng thái" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pass">Pass (Qua môn)</SelectItem>
                <SelectItem value="risk">Risk (Cảnh báo)</SelectItem>
                <SelectItem value="fail">Fail (Trượt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-xs font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>{" "}
              Điểm Auto (Hệ thống)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>{" "}
              Điểm Manual (Nhập tay)
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="w-[300px] py-4 pl-6 font-semibold text-gray-700">
                Sinh viên
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Nhóm
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 w-[100px]">
                Lab 1{" "}
                <span className="text-[10px] text-gray-400 block font-normal">
                  (10%)
                </span>
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 w-[100px]">
                Lab 2{" "}
                <span className="text-[10px] text-gray-400 block font-normal">
                  (10%)
                </span>
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 w-[100px]">
                Assign{" "}
                <span className="text-[10px] text-gray-400 block font-normal">
                  (20%)
                </span>
              </TableHead>
              <TableHead className="text-center w-[140px] bg-blue-50/50 text-blue-700 border-l border-r border-blue-100 p-0">
                <div className="h-full w-full flex flex-col items-center justify-center py-2">
                  <span className="font-bold text-sm">Project (30%)</span>
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 text-[9px] bg-blue-100 text-blue-700 border-0 mt-1 shadow-none"
                  >
                    AUTO
                  </Badge>
                </div>
              </TableHead>
              <TableHead className="text-center font-bold text-gray-900 w-[100px]">
                Tổng kết
              </TableHead>
              <TableHead className="text-center w-[120px] pr-6 font-semibold text-gray-700">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-orange-50/10 transition-colors border-gray-100 group"
              >
                <TableCell className="pl-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-100 ring-2 ring-transparent group-hover:ring-orange-100 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-xs font-bold">
                        {row.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 group-hover:text-[#F27124] transition-colors">
                        {row.name}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {row.code}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-600 border-gray-200 font-normal"
                  >
                    {row.group || "--"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-medium text-gray-600">
                  {row.lab1}
                </TableCell>
                <TableCell className="text-center font-medium text-gray-600">
                  {row.lab2}
                </TableCell>
                <TableCell className="text-center font-medium text-gray-600">
                  {row.assign}
                </TableCell>
                <TableCell className="text-center font-bold text-blue-600 bg-blue-50/30 border-l border-r border-blue-100 text-base">
                  {row.project > 0 ? (
                    row.project
                  ) : (
                    <span className="text-gray-300 text-sm font-normal">
                      --
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`text-lg font-bold ${
                      row.total < 5 ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    {row.total}
                  </span>
                </TableCell>
                <TableCell className="text-center pr-6">
                  {row.status === "Pass" && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 shadow-none px-2.5 py-0.5">
                      Pass
                    </Badge>
                  )}
                  {row.status === "Risk" && (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 shadow-none px-2.5 py-0.5">
                      Risk
                    </Badge>
                  )}
                  {row.status === "Fail" && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 shadow-none px-2.5 py-0.5">
                      Fail
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
