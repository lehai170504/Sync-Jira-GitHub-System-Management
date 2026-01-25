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
    orange: "bg-orange-50 text-[#F27124]",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-orange-100 group">
      <div
        className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${bgColors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p
          className={`font-black text-slate-900 ${isUpper ? "text-xl uppercase tracking-tighter" : "text-3xl tracking-tight"}`}
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
