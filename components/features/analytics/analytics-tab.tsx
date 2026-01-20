"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalyticsToolbar } from "./analytics-toolbar";
import { BurndownChart } from "./burndown-chart";
import { IssueDistributionChart } from "./issue-distribution-chart";
import { mockBurnDownData, mockIssueTypeData } from "./analytics-data";

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* 1. TOOLBAR */}
      <AnalyticsToolbar />

      {/* 2. CHARTS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* LEFT CHART: BURNDOWN */}
        <Card className="col-span-4 border-gray-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Biểu đồ Burndown
            </CardTitle>
            <CardDescription>
              Theo dõi tiến độ hoàn thành công việc so với kế hoạch đề ra.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <BurndownChart data={mockBurnDownData} />
          </CardContent>
        </Card>

        {/* RIGHT CHART: DISTRIBUTION */}
        <Card className="col-span-3 border-gray-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Phân loại Issues
            </CardTitle>
            <CardDescription>
              Tỷ lệ phân bổ các loại công việc trong Sprint hiện tại.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IssueDistributionChart data={mockIssueTypeData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
