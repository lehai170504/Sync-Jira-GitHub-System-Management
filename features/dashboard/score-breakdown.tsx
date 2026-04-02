"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  GitBranch,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { scoreRatioToDisplay10 } from "@/lib/score-display";
import { useTeamRanking } from "@/features/management/teams/hooks/use-team-ranking";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import { useProfile } from "@/features/auth/hooks/use-profile";
import type { TeamRankingMemberRow } from "@/features/management/teams/types";

interface ScoreBreakdownProps {
  classId?: string;
}

const DEFAULT_SCORE_DATA = [
  {
    name: "Jira",
    value: 0,
    color: "#3B82F6",
    icon: CheckCircle2,
    description: "Điểm Jira (ranking)",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
  },
  {
    name: "Git",
    value: 0,
    color: "#10B981",
    icon: GitBranch,
    description: "Điểm Git (ranking)",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
  },
  {
    name: "Peer",
    value: 0,
    color: "#F59E0B",
    icon: Users,
    description: "Đánh giá chéo",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
  },
];

function findMyRankingRow(
  rows: TeamRankingMemberRow[] | undefined,
  userId?: string,
  userEmail?: string,
): TeamRankingMemberRow | undefined {
  if (!rows?.length) return undefined;
  return rows.find((r) => {
    const s = r.student;
    if (!s) return false;
    if (userId && s._id === userId) return true;
    if (userEmail && s.email?.toLowerCase() === userEmail.toLowerCase())
      return true;
    return false;
  });
}

export function ScoreBreakdown({ classId }: ScoreBreakdownProps) {
  const { data: myClasses, isPending: isClassesPending } = useMyClasses();
  const { data: profile, isPending: isProfilePending } = useProfile();

  const teamId = useMemo(() => {
    const classes = myClasses?.classes;
    if (!classes?.length) return undefined;
    if (classId) {
      return classes.find((cls) => cls.class._id === classId)?.team_id;
    }
    return classes[0].team_id;
  }, [myClasses, classId]);

  const { data: rankingData, isPending: isRankingPending } =
    useTeamRanking(teamId);

  const myRow = useMemo(
    () =>
      findMyRankingRow(
        rankingData?.ranking,
        profile?.user?._id,
        profile?.user?.email,
      ),
    [rankingData?.ranking, profile?.user?._id, profile?.user?.email],
  );

  const jiraRatio =
    myRow?.jira?.jira_score ?? myRow?.jira_score ?? 0;
  const gitRatio =
    myRow?.github?.git_score ?? myRow?.git_score ?? 0;

  const jira10 = scoreRatioToDisplay10(jiraRatio);
  const git10 = scoreRatioToDisplay10(gitRatio);
  const peer10 = 0;

  // UI đang hiển thị mỗi nguồn theo thang /10 (Jira/Git).
  // Nếu cộng trực tiếp Jira + Git sẽ vượt /10, nên "Tổng" hiển thị theo trung bình (Jira + Git)/2.
  const overallScore = (jira10 + git10) / 2;

  const realScoreData = useMemo(
    () => [
      { ...DEFAULT_SCORE_DATA[0], value: jira10 },
      { ...DEFAULT_SCORE_DATA[1], value: git10 },
      { ...DEFAULT_SCORE_DATA[2], value: peer10 },
    ],
    [jira10, git10],
  );

  const totalScore = realScoreData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, index, value } = props;
    if (!value) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = realScoreData[index];
    const color = item?.color ?? "#334155";

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {item?.name}
      </text>
    );
  };

  if (isClassesPending) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!teamId) {
    return (
      <Card className="border-dashed border-2 shadow-none bg-slate-50 dark:bg-slate-900/60 dark:border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
          <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
          <p>Bạn chưa tham gia nhóm nào trong lớp này.</p>
        </CardContent>
      </Card>
    );
  }

  if (isRankingPending || isProfilePending) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!myRow) {
    return (
      <Card className="border-dashed border-2 shadow-none bg-slate-50 dark:bg-slate-900/60 dark:border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
          <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
          <p>Không tìm thấy thống kê cá nhân trong bảng xếp hạng nhóm.</p>
        </CardContent>
      </Card>
    );
  }

  const summary = rankingData?.summary;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <BarChart3 className="h-5 w-5 text-[#F27124]" />
                Phân bổ điểm
              </CardTitle>
              {summary ? (
                <p className="text-xs text-muted-foreground mt-2">
                  Nhóm: {summary.total_team_valid_commits} commit hợp lệ ·{" "}
                  {summary.total_team_done_story_points} story points hoàn thành
                </p>
              ) : null}
            </div>
            <div className="px-4 py-2 bg-linear-to-br from-[#F27124] to-orange-600 rounded-xl shadow-md shrink-0">
              <div className="text-2xl font-bold text-white">
                {overallScore.toFixed(1)}
              </div>
              <div className="text-xs text-white/90">Tổng (thang /10)</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[420px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={realScoreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={140}
                  innerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {realScoreData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const item = realScoreData.find((d) => d.name === name);
                    return [`${value.toFixed(1)} /10 (${item?.description})`, name];
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    fontSize: 13,
                    padding: "12px 16px",
                    backgroundColor: "white",
                    fontWeight: 500,
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={50}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "24px" }}
                  formatter={(value) => {
                    const item = realScoreData.find((d) => d.name === value);
                    return (
                      <span
                        style={{
                          color: item?.color,
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        {value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {realScoreData.map((item) => {
          const Icon = item.icon;
          const percentage =
            totalScore > 0
              ? ((item.value / totalScore) * 100).toFixed(1)
              : "0";

          return (
            <Card
              key={item.name}
              className={cn(
                "group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                "bg-white dark:bg-slate-900",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                  item.gradientFrom,
                  item.gradientTo,
                )}
              />

              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: item.color }}
              />

              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-xl shadow-sm"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-muted-foreground">
                      {percentage}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value.toFixed(1)}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    điểm {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>

                <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:shadow-sm"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
