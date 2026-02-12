// src/features/admin/components/dashboard/metric-card.tsx
"use client";

import { Activity, ArrowUpRight, LucideIcon, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  desc: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  desc,
}: MetricCardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-red-600"
        : "text-slate-600";

  return (
    <Card className="rounded-[24px] border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-orange-50 transition-colors">
          <Icon className="h-4 w-4 text-slate-400 group-hover:text-[#F27124]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        <div className="flex items-center mt-1 gap-2">
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded-md bg-slate-50 ${trendColor} flex items-center`}
          >
            {trend === "down" && "-"}
            {change}
          </span>
          <p className="text-xs text-slate-400 font-medium truncate">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
