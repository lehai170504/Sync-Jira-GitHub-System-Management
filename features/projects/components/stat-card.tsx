import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: "orange" | "blue" | "red";
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
      "bg-orange-50 dark:bg-orange-900/10 text-[#F27124] dark:text-orange-400",
    blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
    red: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:translate-y-[-2px] dark:shadow-none">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </p>
        {subText && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-1.5 line-clamp-1">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
}
