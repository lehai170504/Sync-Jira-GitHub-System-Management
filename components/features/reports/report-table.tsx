"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportItem } from "./report-types";
import { toast } from "sonner";

interface ReportTableProps {
  reports: ReportItem[];
}

export function ReportTable({ reports }: ReportTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string, name: string) => {
    setDownloadingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(`Đã tải xuống: ${name}`);
    setDownloadingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ready":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none font-normal">
            Sẵn sàng
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 shadow-none font-normal animate-pulse">
            Đang tạo
          </Badge>
        );
      case "Archived":
        return (
          <Badge variant="secondary" className="font-normal text-gray-500">
            Lưu trữ
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive" className="font-normal">
            Lỗi
          </Badge>
        );
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-gray-100">
        <CardTitle className="text-lg">Lịch sử xuất báo cáo</CardTitle>
        <CardDescription>
          Danh sách các tài liệu đã được tạo trong hệ thống.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-100">
              <TableHead className="w-[40%] pl-6">Tên tài liệu</TableHead>
              <TableHead>Định dạng</TableHead>
              <TableHead>Kích thước</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right pr-6">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-gray-500"
                >
                  Không tìm thấy báo cáo nào.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="group border-gray-100 hover:bg-gray-50/50"
                >
                  <TableCell className="font-medium pl-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${report.type === "Excel" ? "bg-green-50" : "bg-red-50"}`}
                      >
                        {report.type === "Excel" ? (
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {report.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Người tạo: {report.author}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{report.type}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 font-mono">
                      {report.size}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{report.date}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {report.status === "Ready" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                          onClick={() => handleDownload(report.id, report.name)}
                          disabled={!!downloadingId}
                        >
                          {downloadingId === report.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info(`Xem chi tiết: ${report.id}`)
                            }
                          >
                            Chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa file
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <span className="text-xs text-gray-500">
            Hiển thị {reports.length} kết quả
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-8 text-xs"
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              1
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Tiếp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
