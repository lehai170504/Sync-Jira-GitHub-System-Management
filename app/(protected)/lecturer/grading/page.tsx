"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Settings,
  FileSpreadsheet,
  FileText,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { GradingStats } from "@/components/features/lecturer/grading/grading-stats";
import { GradingTable } from "@/components/features/lecturer/grading/grading-table";

// MOCK DATA
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
      <GradingStats
        avgScore={avgScore}
        passRate={passRate}
        riskCount={riskCount}
      />

      {/* 3. GRADEBOOK TABLE */}
      <GradingTable
        data={filteredGrades}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </div>
  );
}
