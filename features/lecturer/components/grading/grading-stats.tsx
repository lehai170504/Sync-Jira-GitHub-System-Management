"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

interface GradingStatsProps {
  avgScore: string;
  passRate: number;
  riskCount: number;
}

export function GradingStats({
  avgScore,
  passRate,
  riskCount,
}: GradingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Điểm Trung Bình Lớp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900">{avgScore}</span>
            <span className="text-sm text-gray-500 mb-1">/ 10</span>
          </div>
          <Progress
            value={parseFloat(avgScore) * 10}
            className="h-1.5 mt-3 bg-blue-100"
            indicatorColor="bg-blue-500"
          />
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white ring-1 ring-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Tỷ lệ Qua môn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {passRate}%
            </span>
            <span className="text-sm text-green-600 font-medium mb-1 flex items-center bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> High
            </span>
          </div>
          <Progress
            value={passRate}
            className="h-1.5 mt-3 bg-green-100"
            indicatorColor="bg-green-500"
          />
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-white ring-1 ring-red-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Cần Chú ý (Risk)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {riskCount}
            </span>
            <span className="text-sm text-gray-500 mb-1">sinh viên</span>
          </div>
          <p className="text-xs text-red-600/80 mt-3 font-medium">
            Có nguy cơ trượt hoặc điểm thấp
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
