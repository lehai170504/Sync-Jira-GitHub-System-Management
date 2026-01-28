"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Loader2,
  History,
} from "lucide-react";
import { toast } from "sonner";
import {
  exportScoreReport,
  exportSRSReport,
} from "@/server/actions/report-actions";
import { downloadBase64File } from "@/lib/download-utils";

export default function ReportsPage() {
  const [loadingType, setLoadingType] = useState<"score" | "srs" | null>(null);

  // Xử lý xuất Excel
  const handleExportScore = async () => {
    setLoadingType("score");
    const res = await exportScoreReport();
    setLoadingType(null);

    if (res.success && res.data && res.filename) {
      downloadBase64File(res.data, res.filename);
      toast.success("Đã tải xuống bảng điểm thành công!");
    } else {
      toast.error(res.error || "Có lỗi xảy ra");
    }
  };

  // Xử lý xuất Word (Demo lỗi/bảo trì)
  const handleExportSRS = async () => {
    setLoadingType("srs");
    const res = await exportSRSReport();
    setLoadingType(null);

    if (res.success) {
      toast.success("Đã tải báo cáo SRS!");
    } else {
      toast.info("Tính năng đang phát triển", {
        description: "Vui lòng quay lại sau.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Xuất báo cáo</h2>
        <p className="text-muted-foreground">
          Trích xuất dữ liệu dự án thành các định dạng tài liệu chuẩn (.xlsx,
          .docx) để nộp cho nhà trường.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CARD 1: EXCEL SCOREBOARD */}
        <Card className="border-l-4 border-l-emerald-500 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              </div>
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-200 bg-emerald-50"
              >
                Khuyên dùng
              </Badge>
            </div>
            <CardTitle className="mt-4">Bảng điểm tổng hợp</CardTitle>
            <CardDescription>
              Xuất file Excel chứa điểm Jira, GitHub, và Peer Review của tất cả
              thành viên. Bao gồm công thức tính điểm trung bình.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • Định dạng: <b>.xlsx</b> (Excel 2007+)
              </p>
              <p>• Dữ liệu: Real-time từ Database</p>
              <p>• Dung lượng ước tính: ~15KB</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleExportScore}
              disabled={!!loadingType}
            >
              {loadingType === "score" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {loadingType === "score" ? "Đang tạo file..." : "Tải Bảng Điểm"}
            </Button>
          </CardFooter>
        </Card>

        {/* CARD 2: SRS WORD DOC */}
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <Badge variant="secondary">Beta</Badge>
            </div>
            <CardTitle className="mt-4">Tài liệu SRS tự động</CardTitle>
            <CardDescription>
              Hệ thống tự động điền các thông tin Use Case, Actor, và Database
              Schema vào mẫu SRS đồ án.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • Định dạng: <b>.docx</b> (Microsoft Word)
              </p>
              <p>• Template: Mẫu quy chuẩn FPT University</p>
              <p>• Yêu cầu: Đã điền đủ thông tin config</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={handleExportSRS}
              disabled={!!loadingType}
            >
              {loadingType === "srs" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Tải Tài Liệu SRS
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* RECENT DOWNLOADS LOG (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4" /> Lịch sử xuất file
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Bang_Diem_Sprint_3.xlsx",
                date: "3 ngày trước",
                size: "12 KB",
                user: "Admin",
              },
              {
                name: "SRS_Draft_v1.docx",
                date: "1 tuần trước",
                size: "2.5 MB",
                user: "Leader",
              },
            ].map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded">
                    {file.name.endsWith("xlsx") ? (
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Tải bởi {file.user} • {file.date}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {file.size}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
