"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Loader2,
  GitCommit,
  ListTodo,
  Users,
  History,
  Clock,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  LayoutDashboard,
  Trophy,
  Star,
  Target,
  Code2,
} from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { exportProjectSrsApi } from "@/features/lecturer/api/ai-api";
import { FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

// --- CHARTS ---
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

// --- HOOKS ---
import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import { useTeamDashboard } from "@/features/lecturer/hooks/use-dashboard";

// --- TYPES ---
import {
  TeamDetailResponse,
  TeamMemberDetail,
} from "@/features/student/types/team-types";
import { TeamMemberBreakdown } from "@/features/lecturer/types/dashboard-types";

// --- COMPONENTS ---
import { TeamReviewsTab } from "@/features/management/classes/components/lecturer/team-reviews-tab";
import { TeamGithubTab } from "@/features/lecturer/components/team/team-github-tab";
import { TeamJiraTab } from "@/features/lecturer/components/team/team-jira-tab";

export const dynamic = "force-dynamic";

const clampScore0To10 = (value: unknown) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(10, Math.max(0, n));
};

export default function LecturerProjectDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const router = useRouter();
  const { teamId } = use(params);
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch dữ liệu
  const { data: detailData, isLoading: isDetailLoading } =
    useTeamDetail(teamId);
  const data = detailData as TeamDetailResponse | undefined;
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useTeamDashboard(teamId);

  const team = data?.team;
  const project = data?.project;
  const members = data?.members || [];
  const stats = data?.stats;

  const githubUrl = project?.githubRepoUrl || team?.github_repo_url;
  const jiraKey = project?.jiraProjectKey || team?.jira_project_key;
  const jiraUrl = team?.jira_url;

  const isLoading = isDetailLoading || isDashboardLoading;

  const handleExportSRS = async () => {
    if (!project?._id) return;
    setIsExporting(true);
    toast.info("AI đang tổng hợp báo cáo SRS, vui lòng đợi...");

    try {
      const blob = await exportProjectSrsApi(project._id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `SRS_Report_${team?.project_name || "Project"}.md`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Xuất báo cáo SRS thành công!");
    } catch (error) {
      toast.error("Xuất báo cáo thất bại. Vui lòng thử lại!");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["team-detail", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["team-dashboard", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["team-commits", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["team-tasks", teamId] }),
      ]);
      toast.success("Đã làm mới dữ liệu thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi làm mới dữ liệu.");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans pb-10 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 w-fit pl-0 gap-2 hover:bg-transparent font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách đồ án
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
              Đang tổng hợp dữ liệu nhóm...
            </p>
          </div>
        ) : !team ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 font-bold uppercase tracking-widest">
            <AlertTriangle className="h-12 w-12 mb-4 text-slate-300 dark:text-slate-700" />
            Không tìm thấy thông tin nhóm.
          </div>
        ) : (
          <>
            {/* =========================================
                1. HEADER INFO & STATS TỔNG HỢP
                ========================================= */}
            <div className="flex flex-col bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm gap-6">
              {/* TOP ROW: Info & Actions */}
              <div className="flex flex-col xl:flex-row justify-between items-start gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="bg-orange-50 dark:bg-orange-900/10 text-[#F27124] dark:text-orange-400 border-orange-200 dark:border-orange-900/30 font-black uppercase text-[10px] tracking-widest"
                    >
                      Team Profile
                    </Badge>
                    {team?.last_sync_at && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> Cập nhật:{" "}
                        {format(new Date(team.last_sync_at), "HH:mm dd/MM")}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
                    {dashboardData?.team_info?.project_name ||
                      team.project_name}
                  </h1>
                  {team.class_id && (
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Lớp:{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {team.class_id.name}
                      </span>{" "}
                      • Môn:{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {team.class_id.subject_id?.code}
                      </span>
                    </p>
                  )}
                </div>

                {/* GÓC PHẢI: CẤU HÌNH ĐỒNG BỘ & XUẤT SRS */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full xl:w-auto mt-2 xl:mt-0">
                  <div className="flex gap-3">
                    <CompactConnectionBadge
                      isConnected={!!githubUrl}
                      type="github"
                      value={
                        githubUrl
                          ? githubUrl.replace("https://github.com/", "")
                          : undefined
                      }
                    />
                    <CompactConnectionBadge
                      isConnected={!!jiraKey}
                      type="jira"
                      value={jiraKey ? `Key: ${jiraKey}` : undefined}
                    />
                  </div>
                  <Button
                    onClick={handleExportSRS}
                    disabled={isExporting || !project?._id}
                    className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-sm transition-all w-full sm:w-auto"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4 mr-2" />
                    )}
                    Xuất Báo Cáo SRS
                  </Button>
                </div>
              </div>

              {/* BOTTOM ROW: BẢNG STATS AI PHÂN TÍCH */}
              {dashboardData && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatCard
                    icon={ListTodo}
                    label="Agile SP Done"
                    value={dashboardData.project_health?.total_jira_sp_done}
                    color="blue"
                  />
                  <StatCard
                    icon={Code2}
                    label="Chất lượng Git"
                    value={`${
                      dashboardData.project_health?.total_git_ai_score || 0
                    }%`}
                    color="emerald"
                  />

                  {/* Card Đặc biệt: Peer Review */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800/50 shadow-sm col-span-2 lg:col-span-1 flex flex-col justify-between">
                    <div className="inline-flex p-2 rounded-xl mb-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 w-fit">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">
                        Peer Review
                      </p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
                          {Number(
                            dashboardData.project_health?.average_peer_review ||
                              0
                          ).toFixed(1)}
                        </p>
                        {Number(
                          dashboardData.project_health?.average_peer_review
                        ) === 5 && (
                          <Trophy className="w-5 h-5 text-yellow-500 mb-0.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  <StatCard
                    icon={GitCommit}
                    label="Commits Hợp lệ/Tổng"
                    value={`${
                      dashboardData.project_health?.team_approved_commits || 0
                    }/${dashboardData.project_health?.team_total_commits || 0}`}
                    color="slate"
                  />
                  <StatCard
                    icon={Target}
                    label="Tổng Tasks"
                    value={dashboardData.project_health?.team_total_tasks}
                    color="purple"
                  />
                </div>
              )}
            </div>

            {/* =========================================
                2. MAIN CONTENT AREA (Tabs)
                ========================================= */}
            <Tabs defaultValue="overview" className="w-full space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-400 text-slate-500 rounded-xl px-5 py-3 text-sm font-bold transition-all gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Tổng quan & Phân
                    tích
                  </TabsTrigger>
                  <TabsTrigger
                    value="github"
                    className="data-[state=active]:bg-slate-800 dark:data-[state=active]:bg-slate-100 data-[state=active]:text-white dark:data-[state=active]:text-slate-900 text-slate-500 rounded-xl px-5 py-3 text-sm font-bold transition-all gap-2"
                  >
                    <SiGithub className="w-4 h-4" /> Lịch sử GitHub
                  </TabsTrigger>
                  <TabsTrigger
                    value="jira"
                    className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 text-slate-500 rounded-xl px-5 py-3 text-sm font-bold transition-all gap-2"
                  >
                    <SiJira className="w-4 h-4" /> Bảng công việc Jira
                  </TabsTrigger>
                </TabsList>

                <Button
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className="w-full md:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm rounded-xl font-bold px-6 py-5 transition-all"
                >
                  <RefreshCw
                    className={cn(
                      "w-4 h-4 mr-2 transition-transform",
                      isRefreshing && "animate-spin"
                    )}
                  />
                  {isRefreshing ? "Đang tải dữ liệu..." : "Làm mới dữ liệu"}
                </Button>
              </div>

              {/* TAB 1: TỔNG QUAN */}
              <TabsContent
                value="overview"
                className="outline-none mt-0 animate-in fade-in duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* CỘT TRÁI: STAT THÀNH VIÊN VỚI SPRINT XẾP DỌC */}
                  <div className="space-y-4 w-full lg:col-span-1">
                    <StatCard
                      icon={Users}
                      label="Thành viên"
                      value={stats?.members}
                      color="orange"
                    />
                    <StatCard
                      icon={GitCommit}
                      label="Commits"
                      value={stats?.commits}
                      color="blue"
                    />
                    <StatCard
                      icon={ListTodo}
                      label="Tasks"
                      value={stats?.tasks}
                      color="emerald"
                    />
                    <StatCard
                      icon={History}
                      label="Sprints"
                      value={stats?.sprints}
                      color="purple"
                    />
                  </div>

                  {/* CỘT PHẢI BỰ (DÀI RA): KẾT HỢP DANH SÁCH & PHÂN TÍCH */}
                  <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden flex flex-col h-full min-h-[500px]">
                    <Tabs
                      defaultValue="members"
                      className="w-full flex-1 flex flex-col"
                    >
                      <TabsList className="w-full sm:w-fit bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex h-auto mb-6 shrink-0">
                        <TabsTrigger
                          value="members"
                          className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6"
                        >
                          Thành viên & Phân tích AI
                        </TabsTrigger>
                        <TabsTrigger
                          value="reviews"
                          className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm py-2 px-6"
                        >
                          Kết quả Đánh giá
                        </TabsTrigger>
                      </TabsList>

                      {/* DANH SÁCH SINH VIÊN + PHÂN TÍCH AI MỚI */}
                      <TabsContent
                        value="members"
                        className="space-y-6 outline-none mt-0 flex-1"
                      >
                        {dashboardData?.members_breakdown ? (
                          dashboardData.members_breakdown.map((mem, index) => (
                            <MemberAnalyticsCard
                              key={mem.student_id || index}
                              data={mem}
                              rank={index + 1}
                              teamTotalCommits={stats?.commits || 0}
                              teamTotalTasks={stats?.tasks || 0}
                            />
                          ))
                        ) : (
                          // Fallback nếu API Dashboard chưa có (dùng Card UI cũ gọn nhẹ)
                          <div className="space-y-3">
                            {members.map((mem) => (
                              <MemberItem key={mem._id} mem={mem} />
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent
                        value="reviews"
                        className="outline-none mt-0 flex-1"
                      >
                        <TeamReviewsTab teamId={team._id} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2 & 3: GITHUB VÀ JIRA */}
              <TabsContent
                value="github"
                className="outline-none mt-0 animate-in fade-in duration-500"
              >
                <TeamGithubTab teamId={teamId} />
              </TabsContent>

              <TabsContent
                value="jira"
                className="outline-none mt-0 animate-in fade-in duration-500"
              >
                <TeamJiraTab teamId={teamId} jiraUrl={jiraUrl} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

// Card hiển thị kết nối Github/Jira gọn nhẹ trên Header
function CompactConnectionBadge({
  isConnected,
  type,
  value,
}: {
  isConnected: boolean;
  type: "github" | "jira";
  value?: string;
}) {
  const isGit = type === "github";
  const Icon = isGit ? SiGithub : SiJira;
  const colorClass = isConnected
    ? isGit
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
      : "bg-blue-600 text-white"
    : "bg-slate-100 dark:bg-slate-800 text-slate-400";

  return (
    <div
      className={cn(
        "flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border transition-all h-12",
        isConnected
          ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
          : "border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-70"
      )}
    >
      <div className={cn("p-2 rounded-lg shrink-0", colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 leading-tight">
          {isGit ? "GitHub" : "Jira"}
        </span>
        <span className="text-xs font-bold truncate max-w-[100px] leading-tight text-slate-700 dark:text-slate-300 mt-0.5">
          {isConnected ? value : "Chưa map"}
        </span>
      </div>
      {isConnected ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-1 shrink-0" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 ml-1 shrink-0" />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    orange:
      "bg-orange-50 dark:bg-orange-900/10 text-[#F27124] dark:text-orange-400",
    blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400",
    slate:
      "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300",
  };
  return (
    <div
      className={cn(
        "p-4 md:p-5 rounded-[24px] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all hover:shadow-md flex flex-col justify-between",
        color === "slate"
          ? "bg-slate-50 dark:bg-slate-900/50"
          : "bg-white dark:bg-slate-900"
      )}
    >
      <div>
        <div
          className={cn(
            "inline-flex p-2 rounded-xl mb-2",
            colors[color as keyof typeof colors]
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5 truncate">
          {label}
        </p>
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none truncate">
        {value || 0}
      </p>
    </div>
  );
}

// Card fallback khi chưa có API Dashboard
function MemberItem({ mem }: { mem: TeamMemberDetail }) {
  const student = mem.student_id;
  return (
    <div className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <AvatarImage src={student?.avatar_url || ""} />
          <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black">
            {student?.full_name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-sm font-black tracking-tight",
                student
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-400 dark:text-slate-600 italic"
              )}
            >
              {student?.full_name || "Chưa gán sinh viên"}
            </p>
            {mem.role_in_team === "Leader" && (
              <Badge className="bg-yellow-400 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-500 hover:bg-yellow-400 border-none text-[9px] font-black uppercase px-2 py-0 h-4">
                Leader
              </Badge>
            )}
          </div>
          {student && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {student.email}
            </p>
          )}
        </div>
      </div>
      {student && (
        <Badge
          variant="outline"
          className="font-mono text-[10px] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 px-2 bg-white dark:bg-slate-900"
        >
          {student.student_code}
        </Badge>
      )}
    </div>
  );
}

// Bảng Phân tích AI được tích hợp
function MemberAnalyticsCard({
  data,
  rank,
  teamTotalCommits,
  teamTotalTasks,
}: {
  data: TeamMemberBreakdown;
  rank: number;
  teamTotalCommits: number;
  teamTotalTasks: number;
}) {
  const factor = Number(data.grading?.contribution_factor || 0);
  const isGanhTeam = factor > 1.05;
  const isTa = factor < 0.95;

  const radarData = [
    {
      subject: "Jira (Task)",
      value: data.contribution_percentages?.jira_percent || 0,
      fullMark: 100,
    },
    {
      subject: "Git (Code)",
      value: data.contribution_percentages?.git_percent || 0,
      fullMark: 100,
    },
    {
      subject: "Review",
      value: data.contribution_percentages?.review_percent || 0,
      fullMark: 100,
    },
  ];

  return (
    <div className="flex flex-col xl:flex-row bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
      <div className="xl:w-2/5 p-5 border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-black text-xs shrink-0 shadow-md">
              #{rank}
            </div>
            <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
              <AvatarImage src={data.avatar_url} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                {data.full_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
                  {data.full_name}
                </h4>
                {data.role === "Leader" && (
                  <Badge className="bg-yellow-400 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-500 hover:bg-yellow-400 border-none text-[9px] font-black uppercase px-1.5 py-0 h-4">
                    Leader
                  </Badge>
                )}
              </div>
              <Badge
                variant="outline"
                className="font-mono text-[10px] bg-white dark:bg-slate-950 px-1.5 py-0 mt-0.5"
              >
                {data.student_code}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Hệ số (Factor)
            </p>
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-sm px-2",
                isGanhTeam
                  ? "bg-emerald-100 text-emerald-700 border-none dark:bg-emerald-900/30 dark:text-emerald-400"
                  : isTa
                  ? "bg-red-100 text-red-700 border-none dark:bg-red-900/30 dark:text-red-400"
                  : "bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              )}
            >
              {factor.toFixed(2)}x
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
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
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#888", fontSize: 9, fontWeight: "bold" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Tỉ lệ %"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-white dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Commits Hợp lệ
            </p>
            <p className="text-lg font-black text-slate-700 dark:text-slate-200 flex justify-center items-baseline gap-1">
              <span className="text-blue-600">
                {data.raw_counts?.approved_commits || 0}
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-[1px]">
                / {teamTotalCommits}
              </span>
            </p>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Tasks Đã làm
            </p>
            <p className="text-lg font-black text-slate-700 dark:text-slate-200 flex justify-center items-baseline gap-1">
              <span className="text-blue-600">
                {data.raw_counts?.total_jira_tasks || 0}
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-[1px]">
                / {teamTotalTasks}
              </span>
            </p>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 text-center col-span-2 flex justify-between items-center">
            <div className="text-left">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Điểm AI (Code)
              </p>
              <p className="text-base font-black text-emerald-600">
                {clampScore0To10(data.raw_scores?.git_ai_score).toFixed(1)}
              </p>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Đánh giá chéo
              </p>
              <p className="text-base font-black text-yellow-600 flex items-center justify-end gap-1">
                {Number(data.raw_scores?.peer_review_score || 0).toFixed(1)}{" "}
                <Star className="w-3 h-3 fill-yellow-600" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
