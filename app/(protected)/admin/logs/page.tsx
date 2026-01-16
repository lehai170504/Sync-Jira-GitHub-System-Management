"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileEdit,
  LogIn,
  ShieldAlert,
  Search,
  Filter,
  XCircle,
} from "lucide-react";

// Mock Data
const initialLogs = [
  {
    id: 1,
    action: "Update Semester",
    status: "Success",
    detail: "Admin thay đổi ngày kết thúc Spring 2026 thành 30/04.",
    time: "10:30 AM",
    date: "Hôm nay",
    user: "admin@fpt.edu.vn",
    icon: FileEdit,
  },
  {
    id: 2,
    action: "Lock User",
    status: "Warning",
    detail: "Khóa tài khoản sinh viên luulb@fpt.edu.vn (Bảo lưu).",
    time: "09:15 AM",
    date: "Hôm nay",
    user: "admin@fpt.edu.vn",
    icon: ShieldAlert,
  },
  {
    id: 3,
    action: "Import Class",
    status: "Success",
    detail: "GV Hiền import lớp SE1740 (30 SV).",
    time: "08:00 AM",
    date: "Hôm nay",
    user: "gv_hien@fpt.edu.vn",
    icon: LogIn,
  },
  {
    id: 4,
    action: "Login Failed",
    status: "Error",
    detail: "Sai mật khẩu 5 lần (IP: 14.162.x.x).",
    time: "11:00 PM",
    date: "Hôm qua",
    user: "unknown",
    icon: AlertCircle,
  },
  {
    id: 5,
    action: "System Backup",
    status: "Success",
    detail: "Sao lưu dữ liệu định kỳ thành công.",
    time: "02:00 AM",
    date: "Hôm qua",
    user: "System",
    icon: CheckCircle2,
  },
];

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Success, Warning, Error

  // Filter Logic
  const filteredLogs = initialLogs.filter((log) => {
    const matchesSearch =
      log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || log.status === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Nhật ký hệ thống
          </h2>
          <p className="text-muted-foreground mt-1">
            Theo dõi hoạt động quản trị và phát hiện lỗi.
          </p>
        </div>

        {/* Quick Stats / Summary (Optional) */}
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
          >
            Active
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
          >
            v2.4.0
          </Badge>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-white ring-1 ring-gray-100 rounded-2xl overflow-hidden">
        <CardHeader className="border-b bg-gray-50/40 px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">Audit Logs</CardTitle>
              <CardDescription>
                Ghi lại mọi thay đổi dữ liệu quan trọng.
              </CardDescription>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Filter Tabs */}
              <div className="flex bg-gray-100/80 p-1 rounded-lg">
                {["All", "Success", "Warning", "Error"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      filterType === type
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm log..."
                  className="pl-9 h-9 bg-white w-full sm:w-64 focus:ring-[#F27124]/20 focus:border-[#F27124]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6">
              {/* Timeline Container */}
              <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="relative pl-8 group">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-white transition-all group-hover:scale-125 ${
                        log.status === "Success"
                          ? "border-green-500 group-hover:bg-green-50"
                          : log.status === "Error"
                          ? "border-red-500 group-hover:bg-red-50"
                          : "border-orange-500 group-hover:bg-orange-50"
                      }`}
                    />

                    {/* Card Item */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all">
                      <div className="flex items-start gap-4">
                        {/* Icon Box */}
                        <div
                          className={`p-2.5 rounded-xl flex-shrink-0 ${
                            log.status === "Success"
                              ? "bg-green-50 text-green-600"
                              : log.status === "Error"
                              ? "bg-red-50 text-red-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          <log.icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {log.action}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 h-5 font-normal bg-gray-100 text-gray-500 border-0"
                            >
                              {log.user}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {log.detail}
                          </p>
                        </div>
                      </div>

                      {/* Meta Info (Time) */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-1 sm:gap-0 text-right min-w-[80px]">
                        <span className="text-xs font-medium text-gray-900">
                          {log.date}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded-full mt-1">
                          <Clock className="h-3 w-3" /> {log.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center ml-[-16px]">
                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                      <Filter className="h-6 w-6 text-gray-300" />
                    </div>
                    <p className="text-gray-500">
                      Không tìm thấy nhật ký nào phù hợp.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterType("All");
                      }}
                      className="text-[#F27124]"
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
