"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function GenerateReportCard() {
  const [loadingType, setLoadingType] = useState<"PDF" | "Excel" | null>(null);

  const handleGenerate = async (type: "PDF" | "Excel") => {
    setLoadingType(type);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock API delay
    toast.success(`Đã tạo báo cáo ${type} thành công!`);
    setLoadingType(null);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 mb-6">
      <CardHeader>
        <CardTitle className="text-blue-900">Tạo báo cáo mới</CardTitle>
        <CardDescription>
          Chọn loại báo cáo để hệ thống tự động trích xuất và tổng hợp dữ liệu
          mới nhất.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 min-w-[160px]"
          onClick={() => handleGenerate("PDF")}
          disabled={!!loadingType}
        >
          {loadingType === "PDF" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Báo cáo Sprint (PDF)
        </Button>
        <Button
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-100 min-w-[160px]"
          onClick={() => handleGenerate("Excel")}
          disabled={!!loadingType}
        >
          {loadingType === "Excel" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Xuất dữ liệu thô (Excel)
        </Button>
      </CardContent>
    </Card>
  );
}
