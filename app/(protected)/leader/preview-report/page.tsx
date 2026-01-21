"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { UserRole } from "@/components/layouts/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye } from "lucide-react";

// Mock dữ liệu preview bảng điểm
const mockPreviewScores = [
  {
    id: "SV01",
    name: "Nguyễn Văn An",
    jira: 8.5,
    git: 9.0,
    review: 8.0,
    total: 8.6,
  },
  {
    id: "SV02",
    name: "Trần Thị B",
    jira: 7.0,
    git: 6.5,
    review: 7.5,
    total: 7.0,
  },
  {
    id: "SV03",
    name: "Lê Hoàng C",
    jira: 9.5,
    git: 9.5,
    review: 9.0,
    total: 9.4,
  },
];

export default function LeaderPreviewReportPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  if (role !== "MEMBER") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Preview Report</h2>
          <p className="text-muted-foreground">
            Trang này chỉ dành cho Leader để xem trước dữ liệu báo cáo.
          </p>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài
            khoản Leader.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-7 w-7 text-slate-300" />
            Preview Report
          </h2>
          <p className="text-muted-foreground">
            Xem trước dữ liệu bảng điểm (mock) trước khi export ra Excel / Word.
          </p>
        </div>

        <Separator />

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Xem trước bảng điểm
              <Badge variant="outline" className="ml-2 text-xs">
                Mock data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-muted-foreground max-w-xl">
              Bảng bên dưới chỉ là dữ liệu giả lập để Leader kiểm tra cấu trúc
              cột, format điểm và một vài bản ghi mẫu trước khi xuất file.
            </p>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Xem preview
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bảng điểm tổng hợp (Preview)</DialogTitle>
            <DialogDescription>
              Dưới đây là cấu trúc và một số dòng dữ liệu mẫu. Khi export, hệ
              thống sẽ sinh đầy đủ danh sách sinh viên từ dữ liệu thật.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Họ và Tên</TableHead>
                  <TableHead>Jira (40%)</TableHead>
                  <TableHead>GitHub (40%)</TableHead>
                  <TableHead>Review (20%)</TableHead>
                  <TableHead>Tổng kết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPreviewScores.map((s, index) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.jira.toFixed(1)}</TableCell>
                    <TableCell>{s.git.toFixed(1)}</TableCell>
                    <TableCell>{s.review.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          s.total >= 9
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : ""
                        }
                      >
                        {s.total.toFixed(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


