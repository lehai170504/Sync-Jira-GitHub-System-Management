// features/lecturer/components/project-detail/member-analytics-card.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { scoreRatioToDisplay10 } from "@/lib/score-display";
import { TeamMemberBreakdown } from "@/features/lecturer/types/dashboard-types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

interface Props {
  data: TeamMemberBreakdown;
  rank: number;
  teamTotalCommits: number;
  teamTotalTasks: number;
}

export function MemberAnalyticsCard({
  data,
  rank,
  teamTotalCommits,
  teamTotalTasks,
}: Props) {
  const factor = Number(data.grading?.contribution_factor || 0);
  const radarData = [
    {
      subject: "Jira (Task)",
      value: data.contribution_percentages?.jira_percent || 0,
    },
    {
      subject: "Git (Code)",
      value: data.contribution_percentages?.git_percent || 0,
    },
    {
      subject: "Review",
      value: data.contribution_percentages?.review_percent || 0,
    },
  ];

  return (
    <div className="flex flex-col xl:flex-row bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-colors">
      <div className="xl:w-2/5 p-5 border-b xl:border-b-0 xl:border-r border-slate-200 bg-white dark:bg-slate-900 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md">
            #{rank}
          </div>
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={data.avatar_url} />
            <AvatarFallback>{data.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
              {data.full_name}
            </h4>
            <Badge variant="outline" className="font-mono text-[10px]">
              {data.student_code}
            </Badge>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
              Hệ số (Factor)
            </p>
            <Badge variant="outline" className="text-sm">
              {factor.toFixed(2)}x
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
              Điểm Chốt
            </p>
            <p className="text-xl font-black text-[#F27124]">
              {Number(data.grading?.final_score || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="xl:w-3/5 p-5 flex flex-col sm:flex-row gap-5 items-center">
        <div className="w-full sm:w-1/2 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid strokeOpacity={0.3} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2">
          <StatsMini
            label="Commits"
            value={data.raw_counts?.approved_commits}
            total={teamTotalCommits}
          />
          <StatsMini
            label="Tasks"
            value={data.raw_counts?.total_jira_tasks}
            total={teamTotalTasks}
          />
        </div>
      </div>
    </div>
  );
}

function StatsMini({ label, value, total }: any) {
  return (
    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 text-center">
      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">
        {label}
      </p>
      <p className="text-lg font-black text-slate-700 dark:text-slate-200">
        <span className="text-blue-600">{value || 0}</span>
        <span className="text-xs text-slate-400">/{total}</span>
      </p>
    </div>
  );
}
