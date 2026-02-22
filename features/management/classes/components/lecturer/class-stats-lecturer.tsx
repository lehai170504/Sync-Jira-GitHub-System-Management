import { Users, UserCheck, Settings } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "orange" | "emerald" | "blue";
  isUpper?: boolean;
}

function StatCard({
  icon,
  label,
  value,
  color,
  isUpper = false,
}: StatCardProps) {
  const bgColors = {
    orange:
      "bg-orange-50 dark:bg-orange-900/10 text-[#F27124] dark:text-orange-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-orange-100 dark:hover:border-orange-900/50 group">
      <div
        className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${bgColors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p
          className={`font-black text-slate-900 dark:text-slate-100 ${
            isUpper
              ? "text-xl uppercase tracking-tighter"
              : "text-3xl tracking-tight"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

interface ClassStatsProps {
  totalStudents: number;
  totalTeams: number;
  jiraWeight: number;
}

export function ClassStats({
  totalStudents,
  totalTeams,
  jiraWeight,
}: ClassStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={<Users className="h-6 w-6" />}
        label="Tổng sinh viên"
        value={totalStudents}
        color="orange"
      />
      <StatCard
        icon={<UserCheck className="h-6 w-6" />}
        label="Tổng nhóm"
        value={totalTeams}
        color="emerald"
      />
      <StatCard
        icon={<Settings className="h-6 w-6" />}
        label="Trọng số Jira"
        value={`${(jiraWeight * 100).toFixed(0)}%`}
        color="blue"
        isUpper
      />
    </div>
  );
}
