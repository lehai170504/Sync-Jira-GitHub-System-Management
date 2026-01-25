import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: "orange" | "blue" | "red";
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  const colors = {
    orange: "bg-orange-50 text-[#F27124]",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:translate-y-[-2px]">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
