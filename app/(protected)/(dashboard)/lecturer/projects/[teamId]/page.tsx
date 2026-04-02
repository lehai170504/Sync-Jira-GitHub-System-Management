"use client";

export const dynamic = "force-dynamic";

import { use, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Loader2, 
  LayoutDashboard, 
  RefreshCw, 
  Users, 
  GitCommit, 
  ListTodo, 
  History,
  AlertTriangle 
} from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- IMPORT COMPONENTS ĐÃ TÁCH ---
import { StatCard } from "@/features/projects/components/stat-card";
import { ProjectHeader } from "@/features/lecturer/components/project-detail/project-header";
import { MemberAnalyticsCard } from "@/features/lecturer/components/project-detail/member-analytics-card";
import { TeamGithubTab } from "@/features/lecturer/components/project-detail/team-github-tab";
import { TeamJiraTab } from "@/features/lecturer/components/project-detail/team-jira-tab";
import { TeamReviewsTab } from "@/features/management/classes/components/lecturer/team-reviews-tab";

// --- HOOKS & TYPES ---
import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import { useTeamDashboard } from "@/features/lecturer/hooks/use-dashboard";
import { TeamDetailResponse } from "@/features/student/types/team-types";

// ==========================================
// 1. PROJECT DETAIL CONTENT (LOGIC CHÍNH)
// ==========================================
function ProjectDetailContent({ teamId }: { teamId: string }) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dữ liệu tổng quát và dashboard
  const { data: detailData, isLoading: isDetailLoading } = useTeamDetail(teamId);
  const data = detailData as TeamDetailResponse | undefined;
  const { data: dashboardData, isLoading: isDashboardLoading } = useTeamDashboard(teamId);

  const isLoading = isDetailLoading || isDashboardLoading;
  const team = data?.team;

  // Hàm làm mới dữ liệu thủ công
  const handleRefresh = async () => {
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
      toast.error("Lỗi khi làm mới dữ liệu.");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!team) return <NotFoundView />;

  return (
    <div className="min-h-screen font-sans pb-10 bg-slate-50/30 dark:bg-transparent">
      {/* Header chứa các chỉ số sức khỏe dự án và xuất SRS */}
      <ProjectHeader team={team} dashboardData={dashboardData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Tabs defaultValue="overview" className="w-full space-y-6">
          
          {/* Thanh điều khiển Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 rounded-xl px-5 py-3 text-sm font-bold gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Tổng quan
              </TabsTrigger>
              <TabsTrigger 
                value="github" 
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-xl px-5 py-3 text-sm font-bold gap-2"
              >
                <SiGithub className="w-4 h-4" /> GitHub
              </TabsTrigger>
              <TabsTrigger 
                value="jira" 
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-xl px-5 py-3 text-sm font-bold gap-2"
              >
                <SiJira className="w-4 h-4" /> Jira
              </TabsTrigger>
            </TabsList>

            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline"
              className="w-full md:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 rounded-xl font-bold px-6"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Đang tải..." : "Làm mới dữ liệu"}
            </Button>
          </div>

          {/* TAB 1: TỔNG QUAN & PHÂN TÍCH THÀNH VIÊN */}
          <TabsContent value="overview" className="outline-none animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Cột trái: Stats nhanh */}
              <div className="space-y-4 lg:col-span-1">
                <StatCard icon={Users} label="Thành viên" value={data?.stats?.members} color="orange" />
                <StatCard icon={GitCommit} label="Commits" value={data?.stats?.commits} color="blue" />
                <StatCard icon={ListTodo} label="Tasks" value={data?.stats?.tasks} color="emerald" />
                <StatCard icon={History} label="Sprints" value={data?.stats?.sprints} color="purple" />
              </div>

              {/* Cột phải: Member Analytics */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <Tabs defaultValue="members" className="w-full">
                  <TabsList className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl mb-6">
                    <TabsTrigger value="members" className="rounded-xl text-[11px] font-black uppercase px-6">Thành viên & AI</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-xl text-[11px] font-black uppercase px-6">Kết quả đánh giá</TabsTrigger>
                  </TabsList>

                  <TabsContent value="members" className="space-y-6">
                    {dashboardData?.members_breakdown?.map((mem: any, index: number) => (
                      <MemberAnalyticsCard 
                        key={mem.student_id || index} 
                        data={mem} 
                        rank={index + 1} 
                        teamTotalCommits={data?.stats?.commits || 0} 
                        teamTotalTasks={data?.stats?.tasks || 0} 
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="reviews">
                    <TeamReviewsTab teamId={teamId} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: GITHUB HISTORY */}
          <TabsContent value="github" className="outline-none">
            <TeamGithubTab teamId={teamId} />
          </TabsContent>

          {/* TAB 3: JIRA KANBAN */}
          <TabsContent value="jira" className="outline-none">
            <TeamJiraTab teamId={teamId} jiraUrl={team.jira_url} />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

// ==========================================
// 2. EXPORT CHÍNH VỚI NEXT.JS 15 PARAMS
// ==========================================
export default function LecturerProjectDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = use(params);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProjectDetailContent teamId={teamId} />
    </Suspense>
  );
}

// ==========================================
// 3. SUB-COMPONENTS HỖ TRỢ (PRIVATE)
// ==========================================

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
        Đang đồng bộ dữ liệu đồ án...
      </p>
    </div>
  );
}

function NotFoundView() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-slate-400 font-bold uppercase tracking-widest">
      <AlertTriangle className="h-12 w-12 mb-4 text-slate-300" />
      Không tìm thấy thông tin nhóm dự án.
    </div>
  );
}