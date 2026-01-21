"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Search,
  Filter,
  FileText,
  Settings,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Archive,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- MOCK DATA ---
const GRADES = [
  {
    id: "SV001",
    name: "Nguyễn Văn An",
    code: "SE170101",
    group: "Team 1",
    lab1: 9.0,
    lab2: 8.5,
    assign: 8.0,
    project: 9.2,
    total: 8.8,
    status: "Pass",
  },
  {
    id: "SV002",
    name: "Trần Thị Bích",
    code: "SE170102",
    group: "Team 1",
    lab1: 7.0,
    lab2: 6.5,
    assign: 7.0,
    project: 5.5,
    total: 6.4,
    status: "Risk",
  },
  {
    id: "SV003",
    name: "Lê Văn Cường",
    code: "SE170103",
    group: "Team 2",
    lab1: 8.5,
    lab2: 9.0,
    assign: 8.5,
    project: 8.8,
    total: 8.7,
    status: "Pass",
  },
  {
    id: "SV004",
    name: "Phạm Minh Duy",
    code: "SE170104",
    group: null,
    lab1: 0,
    lab2: 0,
    assign: 0,
    project: 0,
    total: 0,
    status: "Fail",
  },
];

export default function GradingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredGrades = GRADES.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || s.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const avgScore = (
    GRADES.reduce((acc, curr) => acc + curr.total, 0) / GRADES.length
  ).toFixed(1);
  const passRate = Math.round(
    (GRADES.filter((s) => s.status === "Pass").length / GRADES.length) * 100
  );
  const riskCount = GRADES.filter(
    (s) => s.status === "Risk" || s.status === "Fail"
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Sổ điểm & Báo cáo
          </h1>
          <p className="text-gray-500 mt-2">
            Tổng hợp kết quả học tập và xuất các báo cáo định kỳ
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/lecturer/settings")}
            className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm"
          >
            <Settings className="mr-2 h-4 w-4" /> Cấu hình trọng số
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
                <Download className="mr-2 h-4 w-4" /> Xuất Báo cáo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Chọn loại báo cáo
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2 p-3 hover:bg-gray-50 rounded-md">
                <div className="p-2 bg-green-50 rounded-full text-green-600">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bảng điểm Excel</p>
                  <p className="text-xs text-gray-500">
                    File .xlsx chuẩn đào tạo
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 p-3 hover:bg-gray-50 rounded-md">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tài liệu SRS</p>
                  <p className="text-xs text-gray-500">Tổng hợp PDF các nhóm</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 p-3 hover:bg-gray-50 rounded-md">
                <div className="p-2 bg-orange-50 rounded-full text-orange-600">
                  <Archive className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Evidence Package</p>
                  <p className="text-xs text-gray-500">File .zip minh chứng</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Điểm Trung Bình Lớp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-900">
                {avgScore}
              </span>
              <span className="text-sm text-gray-500 mb-1">/ 10</span>
            </div>
            <Progress
              value={parseFloat(avgScore) * 10}
              className="h-1.5 mt-3 bg-blue-100"
              indicatorColor="bg-blue-500"
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white ring-1 ring-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Tỷ lệ Qua môn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-900">
                {passRate}%
              </span>
              <span className="text-sm text-green-600 font-medium mb-1 flex items-center bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> High
              </span>
            </div>
            <Progress
              value={passRate}
              className="h-1.5 mt-3 bg-green-100"
              indicatorColor="bg-green-500"
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-white ring-1 ring-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Cần Chú ý (Risk)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-900">
                {riskCount}
              </span>
              <span className="text-sm text-gray-500 mb-1">sinh viên</span>
            </div>
            <p className="text-xs text-red-600/80 mt-3 font-medium">
              Có nguy cơ trượt hoặc điểm thấp
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. GRADEBOOK TABLE */}
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

                {/* CỘT ĐIỂM AUTO - NỔI BẬT */}
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
              {filteredGrades.map((row) => (
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

                  {/* Điểm thành phần */}
                  <TableCell className="text-center font-medium text-gray-600">
                    {row.lab1}
                  </TableCell>
                  <TableCell className="text-center font-medium text-gray-600">
                    {row.lab2}
                  </TableCell>
                  <TableCell className="text-center font-medium text-gray-600">
                    {row.assign}
                  </TableCell>

                  {/* Điểm Project Auto */}
                  <TableCell className="text-center font-bold text-blue-600 bg-blue-50/30 border-l border-r border-blue-100 text-base">
                    {row.project > 0 ? (
                      row.project
                    ) : (
                      <span className="text-gray-300 text-sm font-normal">
                        --
                      </span>
                    )}
                  </TableCell>

                  {/* Tổng kết */}
                  <TableCell className="text-center">
                    <span
                      className={`text-lg font-bold ${
                        row.total < 5 ? "text-red-500" : "text-gray-800"
                      }`}
                    >
                      {row.total}
                    </span>
                  </TableCell>

                  {/* Status Badge */}
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
    </div>
  );
}
