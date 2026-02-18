"use client";

import { LucideIcon } from "lucide-react";
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
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
      : trend === "down"
        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
        : "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800";

  return (
    <Card className="rounded-[24px] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg hover:shadow-orange-500/5 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {title}
        </CardTitle>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-[#F27124]/10 dark:group-hover:bg-[#F27124]/20 transition-colors duration-300">
          <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#F27124] transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter mt-1">
          {value}
        </div>
        <div className="flex items-center mt-2 gap-2">
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center ${trendColor}`}
          >
            {trend === "down" && "-"}
            {trend === "up" && "+"}
            {change}
          </span>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
            {desc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
