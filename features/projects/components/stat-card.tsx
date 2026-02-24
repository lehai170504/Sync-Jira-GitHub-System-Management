import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: "orange" | "blue" | "red" | "emerald" | "purple";
  subText?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color,
  subText,
}: StatCardProps) {
  const colors = {
    orange:
      "bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400",
    blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
    red: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
      <div className={cn("p-3 rounded-2xl shrink-0", colors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-0.5">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
          {value}
        </p>
        {subText && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
}
