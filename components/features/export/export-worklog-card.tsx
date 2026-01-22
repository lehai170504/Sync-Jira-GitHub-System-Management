"use client";

import { Loader2, FileText, Download, Clock, Sparkles, FileCheck } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatExportTimestamp } from "./utils";

interface ExportWorklogCardProps {
  lastExportAt: string | null;
  loading: boolean;
  onExport: () => void;
}

export function ExportWorklogCard({ lastExportAt, loading, onExport }: ExportWorklogCardProps) {
  const lastExportLabel = formatExportTimestamp(lastExportAt);

  return (
    <Card className="border-2 shadow-xl overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
      {/* HEADER WITH GRADIENT */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white mb-1">
                Worklog Word
              </CardTitle>
              <p className="text-blue-50 text-sm">
                Xuất file mô tả chi tiết công việc theo Sprint
              </p>
            </div>
          </div>
          {lastExportAt && (
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Clock className="h-3 w-3 mr-1" />
              Đã xuất
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* FILE INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Định dạng</p>
              <p className="text-sm font-semibold text-blue-700">.docx</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Nội dung</p>
              <p className="text-sm font-semibold text-blue-700">Task, effort, ghi chú</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Lần xuất gần nhất</p>
              <p className="text-sm font-semibold text-blue-700">{lastExportLabel}</p>
            </div>
          </div>
        </div>

        {/* EXPORT BUTTON */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>File sẽ được tải xuống tự động sau khi tạo</span>
          </div>
          <Button
            onClick={onExport}
            disabled={loading}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Xuất Word
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

