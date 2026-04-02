// features/lecturer/components/project-detail/stat-card.tsx
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number | undefined;
  color: "orange" | "blue" | "emerald" | "purple" | "slate";
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colors = {
    orange: "bg-orange-50 text-[#F27124]",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    slate: "bg-slate-50 text-slate-600",
  };

  return (
    <div
      className={cn(
        "p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:shadow-md flex flex-col justify-between bg-white dark:bg-slate-900",
        color === "slate" && "bg-slate-50 dark:bg-slate-900/50",
      )}
    >
      <div>
        <div className={cn("inline-flex p-2 rounded-xl mb-2", colors[color])}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
          {label}
        </p>
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
        {value || 0}
      </p>
    </div>
  );
}
