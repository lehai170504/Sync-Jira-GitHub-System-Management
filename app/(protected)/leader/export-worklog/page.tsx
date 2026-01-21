"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader2, FileText, Download } from "lucide-react";

import { UserRole } from "@/components/layouts/sidebar";
import { exportSRSReport } from "@/server/actions/report-actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function LeaderExportWorklogPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  const handleExport = async () => {
    try {
      setLoading(true);
      const res = await exportSRSReport();

      // Hiện tại server action đang mock "đang bảo trì"
      if (res.success) {
        toast.success("Đã xuất file Worklog (mock).");
      } else {
        toast.info("Tính năng xuất Worklog Word đang được mô phỏng (mock).", {
          description:
            "Trong bản triển khai thật, file .docx sẽ được tạo và tải về tự động.",
        });
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra khi gọi xuất Worklog.");
    } finally {
      setLoading(false);
    }
  };

  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Export Worklog</h2>
          <p className="text-muted-foreground">
            Trang này chỉ dành cho Leader để xuất file Word mô tả công việc.
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
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-7 w-7 text-blue-500" />
          Export Worklog (Word)
        </h2>
        <p className="text-muted-foreground">
          Xuất file <b>.docx</b> mô tả chi tiết công việc của từng thành viên
          theo Sprint (mock UI).
        </p>
      </div>

      <Separator />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">
            Worklog mô tả công việc (Mock)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Định dạng dự kiến: <b>.docx</b> • Nội dung: mô tả task, effort,
              ghi chú cho từng thành viên.
            </div>
            <Button
              onClick={handleExport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {loading ? "Đang xử lý..." : "Xuất Word (Mock)"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


