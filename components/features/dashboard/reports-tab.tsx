"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileSpreadsheet, Clock } from "lucide-react";

const reports = [
  {
    id: "R01",
    name: "Báo cáo tổng kết Sprint 4",
    type: "PDF",
    date: "15/01/2026",
    size: "2.4 MB",
    status: "Ready",
  },
  {
    id: "R02",
    name: "Bảng điểm chi tiết Sinh viên",
    type: "Excel",
    date: "14/01/2026",
    size: "450 KB",
    status: "Ready",
  },
  {
    id: "R03",
    name: "Phân tích rủi ro & Chất lượng",
    type: "PDF",
    date: "10/01/2026",
    size: "1.2 MB",
    status: "Archived",
  },
  {
    id: "R04",
    name: "Báo cáo tiến độ tuần 3",
    type: "PDF",
    date: "07/01/2026",
    size: "1.8 MB",
    status: "Archived",
  },
];

export function ReportsTab() {
  return (
    <div className="grid gap-6">
      {/* GENERATE NEW REPORT CARD */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">Tạo báo cáo mới</CardTitle>
          <CardDescription>
            Chọn loại báo cáo và khoảng thời gian để hệ thống tự động trích xuất
            dữ liệu.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="mr-2 h-4 w-4" /> Báo cáo Sprint
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Xuất Excel Dữ liệu thô
          </Button>
        </CardContent>
      </Card>

      {/* REPORTS HISTORY TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử xuất báo cáo</CardTitle>
          <CardDescription>
            Các tài liệu đã được tạo trong 30 ngày qua.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên tài liệu</TableHead>
                <TableHead>Định dạng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {report.type === "Excel" ? (
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-red-500" />
                    )}
                    {report.name}
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {report.date}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "Ready" ? "default" : "secondary"
                      }
                      className={
                        report.status === "Ready"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : ""
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Tải về
                    </Button>
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
