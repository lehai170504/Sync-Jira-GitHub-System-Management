"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader2, FileSpreadsheet, Download } from "lucide-react";

import { UserRole } from "@/components/layouts/sidebar";
import { exportScoreReport } from "@/server/actions/report-actions";
import { downloadBase64File } from "@/lib/download-utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const LAST_EXPORT_KEY = "leader_export_score_lastRun";

export default function LeaderExportScorePage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [loading, setLoading] = useState(false);
  const [lastExportAt, setLastExportAt] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);

    const last = window.localStorage.getItem(LAST_EXPORT_KEY);
    if (last) setLastExportAt(last);
  }, []);

  const lastExportLabel = useMemo(() => {
    if (!lastExportAt) return "Chưa có";
    const d = new Date(lastExportAt);
    if (Number.isNaN(d.getTime())) return "Không xác định";
    return d.toLocaleString();
  }, [lastExportAt]);

  const handleExport = async () => {
    try {
      setLoading(true);
      const res = await exportScoreReport();

      if (res.success && res.data && res.filename) {
        downloadBase64File(res.data, res.filename);
        const now = new Date().toISOString();
        window.localStorage.setItem(LAST_EXPORT_KEY, now);
        setLastExportAt(now);
        toast.success("Đã tải xuống bảng điểm Excel!");
        return;
      }

      toast.error(res.error || "Có lỗi xảy ra khi xuất bảng điểm.");
    } catch (e) {
      toast.error("Có lỗi xảy ra khi xuất bảng điểm.");
    } finally {
      setLoading(false);
    }
  };

  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Export Score</h2>
          <p className="text-muted-foreground">
            Trang này chỉ dành cho Leader để xuất bảng điểm Excel.
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
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
            Xuất bảng điểm Excel
          </h2>
          <p className="text-muted-foreground">
            Xuất file <b>.xlsx</b> chứa điểm Jira / GitHub / Peer Review (mock
            data) để Leader tải về.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase">
            Lần export gần nhất
          </p>
          <p className="text-sm font-semibold">{lastExportLabel}</p>
        </div>
      </div>

      <Separator />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Bảng điểm tổng hợp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Định dạng: <b>.xlsx</b> • Sheet: <b>Bang Diem Tong Hop</b>
            </div>
            <Button
              onClick={handleExport}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {loading ? "Đang tạo file..." : "Xuất Excel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


