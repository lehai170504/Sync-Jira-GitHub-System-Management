"use client";

import { useEffect, useState } from "react";
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

// Hooks
import { useTeamDashboard } from "@/features/management/teams/hooks/use-team-dashboard";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";

// --- Types & Interfaces ---
interface ScoreBreakdownProps {
  classId?: string;
}

// Mock Data mặc định (dùng khi chưa có API hoặc data rỗng)
const DEFAULT_SCORE_DATA = [
  {
    name: "Jira",
    value: 0,
    color: "#3B82F6",
    icon: CheckCircle2,
    description: "Tasks hoàn thành",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
  },
  {
    name: "Git",
    value: 0,
    color: "#10B981",
    icon: GitBranch,
    description: "Code commits",
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

export function ScoreBreakdown({ classId }: ScoreBreakdownProps) {
  // 1. Logic lấy Team ID (Tái sử dụng logic từ MemberOverviewTab)
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const { data: myClasses, isLoading: isClassesLoading } = useMyClasses();

  // Hook lấy dữ liệu dashboard (chứa thông tin điểm số nếu có)
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useTeamDashboard(teamId);

  useEffect(() => {
    if (!myClasses?.classes) return;

    if (classId) {
      const currentClass = myClasses.classes.find(
        (cls) => cls.class._id === classId,
      );
      setTeamId(currentClass?.team_id);
    } else if (myClasses.classes.length > 0) {
      setTeamId(myClasses.classes[0].team_id);
    }
  }, [myClasses, classId]);

  // --- Data Transformation ---
  // Lưu ý: Logic này giả định dashboardData trả về cấu trúc điểm tương tự.
  // Nếu API chưa có, ta dùng Mock Data tạm thời nhưng vẫn giữ flow fetch API.

  // Ví dụ transform data thật (nếu có):
  const realScoreData = dashboardData?.overview
    ? [
        {
          ...DEFAULT_SCORE_DATA[0],
          value: dashboardData.overview.tasks?.done_percent || 0,
        }, // Jira lấy % task done
        {
          ...DEFAULT_SCORE_DATA[1],
          value: dashboardData.overview.commits?.total || 0,
        }, // Git lấy tổng commit (cần chuẩn hóa thang điểm sau)
        { ...DEFAULT_SCORE_DATA[2], value: 85 }, // Peer Review (giả định chưa có API thì mock 85)
      ]
    : DEFAULT_SCORE_DATA; // Fallback về mặc định nếu chưa có data

  // Tính tổng điểm (Ví dụ đơn giản là cộng lại, thực tế cần công thức trọng số)
  const totalScore = realScoreData.reduce((sum, item) => sum + item.value, 0);

  // --- Loading State ---
  if (isClassesLoading || (teamId && isDashboardLoading)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F27124]" />
      </div>
    );
  }

  // --- Empty State ---
  if (!teamId) {
    return (
      <Card className="border-dashed border-2 shadow-none bg-slate-50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
          <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
          <p>Bạn chưa tham gia nhóm nào trong lớp này.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Chart Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#F27124]" />
                Phân bổ điểm (Score Breakdown)
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1.5">
                Tỷ lệ điểm từ các nguồn: Jira, Git, và Peer Review
              </p>
            </div>
            <div className="px-4 py-2 bg-gradient-to-br from-[#F27124] to-orange-600 rounded-xl shadow-md">
              <div className="text-2xl font-bold text-white">{totalScore}</div>
              <div className="text-xs text-white/90">Tổng điểm</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[420px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={realScoreData} // Dùng data đã transform
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => {
                    return `${name}\n${value} (${(percent * 100).toFixed(0)}%)`;
                  }}
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
                    return [`${value} điểm (${item?.description})`, name];
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

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {realScoreData.map((item) => {
          const Icon = item.icon;
          const percentage =
            totalScore > 0 ? ((item.value / totalScore) * 100).toFixed(1) : "0";

          return (
            <Card
              key={item.name}
              className={cn(
                "group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                "bg-gradient-to-br from-white to-gray-50/30",
              )}
            >
              {/* Gradient Background Effect */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                  item.gradientFrom,
                  item.gradientTo,
                )}
              />

              {/* Decorative Circle */}
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
                    {item.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    điểm {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
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
