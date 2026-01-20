"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Database, FileBarChart, HardDrive } from "lucide-react";
import { ReportItem } from "./report-types";

export function ReportStats({ reports }: { reports: ReportItem[] }) {
  const totalReports = reports.length;
  const totalSizeMB = reports
    .reduce((acc, r) => acc + parseFloat(r.size), 0)
    .toFixed(1); // Mock calculation
  const processing = reports.filter((r) => r.status === "Processing").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng tài liệu
            </p>
            <h3 className="text-2xl font-bold">{totalReports}</h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <FileBarChart className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dung lượng
            </p>
            <h3 className="text-2xl font-bold">{totalSizeMB} MB</h3>
          </div>
          <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <HardDrive className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-orange-500">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang xử lý
            </p>
            <h3 className="text-2xl font-bold text-orange-600">{processing}</h3>
          </div>
          <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
            <Database className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
