"use client";

import { useMemo } from "react";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cell, Pie, PieChart as RechartsPie, ResponsiveContainer, Tooltip } from "recharts";

interface ScoreDistribution {
  excellent?: number;
  good?: number;
  average?: number;
  poor?: number;
}

interface KpiOverview {
  is_graded?: boolean;
  total_students?: number;
}

interface LecturerScoreChartProps {
  distribution?: ScoreDistribution;
  overview?: KpiOverview;
}

const CHART_COLORS = {
  excellent: "#10b981",
  good: "#3b82f6",
  average: "#f59e0b",
  poor: "#ef4444",
};

const CHART_LABELS = {
  excellent: "Giỏi (8-10)",
  good: "Khá (6.5-7.9)",
  average: "TB (5-6.4)",
  poor: "Yếu (<5)",
};

export function LecturerScoreChart({ distribution, overview }: LecturerScoreChartProps) {
  const chartData = useMemo(() => {
    const raw = [
      { name: CHART_LABELS.excellent, value: distribution?.excellent || 0, color: CHART_COLORS.excellent },
      { name: CHART_LABELS.good, value: distribution?.good || 0, color: CHART_COLORS.good },
      { name: CHART_LABELS.average, value: distribution?.average || 0, color: CHART_COLORS.average },
      { name: CHART_LABELS.poor, value: distribution?.poor || 0, color: CHART_COLORS.poor },
    ];
    return raw.filter((d) => d.value > 0);
  }, [distribution]);

  return (
    <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden">
      <CardHeader className="px-8 pt-8 pb-0">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex justify-between items-center">
          Phổ điểm của lớp
          {!overview?.is_graded && (
            <Badge variant="outline" className="text-[9px]">
              Dự kiến
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8">
        {chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <PieChart className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm font-medium">Chưa có dữ liệu phổ điểm</p>
          </div>
        ) : (
          <>
            <div className="relative w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={chartData}
                    innerRadius={80}
                    outerRadius={105}
                    paddingAngle={5}
                    dataKey="value"
                    strokeWidth={0}
                    cornerRadius={8}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      backgroundColor: "var(--tw-colors-slate-900)",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tighter">
                  {overview?.total_students}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-[0.1em] mt-1">
                  Sinh viên
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 w-full">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                    {item.name}: {item.value} SV
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
