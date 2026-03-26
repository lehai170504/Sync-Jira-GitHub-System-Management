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

// --- HOOKS ---
import { useTeamDetail } from "@/features/student/hooks/use-team-detail";

// --- TYPES ---
import {
  TeamDetailResponse,
  TeamMemberDetail,
} from "@/features/student/types/team-types";

// --- COMPONENTS ---
import { TeamReviewsTab } from "@/features/management/classes/components/lecturer/team-reviews-tab";
import { TeamGithubTab } from "@/features/lecturer/components/team/team-github-tab";
import { TeamJiraTab } from "@/features/lecturer/components/team/team-jira-tab";

export default function LecturerProjectDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const router = useRouter();
  const { teamId } = use(params);
  const queryClient = useQueryClient();

  // Trạng thái cho nút Refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dữ liệu chi tiết nhóm
  const { data: detailData, isLoading } = useTeamDetail(teamId);
  const data = detailData as TeamDetailResponse | undefined;

  const team = data?.team;
  const project = data?.project;
  const members = data?.members || [];
  const stats = data?.stats;

  const githubUrl = project?.githubRepoUrl || team?.github_repo_url;
  const jiraKey = project?.jiraProjectKey || team?.jira_project_key;
  const jiraUrl = team?.jira_url; // Khai báo rõ ràng biến jiraUrl
  const [isExporting, setIsExporting] = useState(false);

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
  // Xử lý Làm mới dữ liệu (Thay thế cho hàm Sync cũ)
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate Queries để React Query tự động fetch lại các API GET
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["team-detail", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["team-commits", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["team-tasks", teamId] }),
      ]);
      toast.success("Đã làm mới dữ liệu thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi làm mới dữ liệu.");
    } finally {
      // Delay 1 chút cho animation mượt mà
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans pb-10 animate-in fade-in duration-500">
      {/* --- NÚT QUAY LẠI --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 w-fit pl-0 gap-2 hover:bg-transparent font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách đồ án
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
              Đang nạp dữ liệu nhóm...
            </p>
          </div>
        ) : !team ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 font-bold uppercase tracking-widest">
            <AlertTriangle className="h-12 w-12 mb-4 text-slate-300 dark:text-slate-700" />
            Không tìm thấy thông tin nhóm.
          </div>
        ) : (
          <>
            {/* 1. HEADER INFO */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
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
                      <Clock className="w-3 h-3" /> Cập nhật lần cuối:{" "}
                      {format(new Date(team.last_sync_at), "HH:mm dd/MM")}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
                  {team.project_name}
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
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <Button
                  onClick={handleExportSRS}
                  disabled={isExporting || !project?._id}
                  className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-sm transition-all"
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

            {/* 2. MAIN CONTENT AREA (Với 3 Tab Lớn) */}
            <Tabs defaultValue="overview" className="w-full space-y-6">
              {/* TABS MENU & REFRESH BUTTON */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-400 text-slate-500 rounded-xl px-5 py-3 text-sm font-bold transition-all gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Tổng quan nhóm
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

                {/* NÚT LÀM MỚI DỮ LIỆU */}
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

              {/* =========================================
                  TAB 1: TỔNG QUAN (Layout chia 2 cột như cũ)
                  ========================================= */}
              <TabsContent
                value="overview"
                className="outline-none mt-0 animate-in fade-in duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* LEFT COLUMN: KÊNH TÍCH HỢP & STATS */}
                  <div className="space-y-8 w-full overflow-hidden">
                    <section className="grid grid-cols-2 gap-4">
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
                    </section>

                    <section className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm w-full overflow-hidden">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                        Cấu hình đồng bộ
                      </h3>
                      <div className="grid gap-3 w-full">
                        <ConnectionRow
                          isConnected={!!githubUrl}
                          label="GitHub Repository"
                          subLabel={
                            githubUrl
                              ? githubUrl.replace("https://github.com/", "")
                              : undefined
                          }
                          icon={SiGithub}
                          colorClass="bg-slate-900 dark:bg-slate-800 text-white"
                        />
                        <ConnectionRow
                          isConnected={!!jiraKey}
                          label="Jira Workspace"
                          subLabel={jiraKey ? `Key: ${jiraKey}` : undefined}
                          icon={SiJira}
                          colorClass="bg-blue-600 text-white"
                        />
                      </div>
                    </section>
                  </div>

                  {/* RIGHT COLUMN: DANH SÁCH THÀNH VIÊN VÀ ĐÁNH GIÁ */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden flex flex-col">
                    <Tabs
                      defaultValue="members"
                      className="w-full flex-1 flex flex-col"
                    >
                      <TabsList className="w-full sm:w-fit bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex h-auto mb-6">
                        <TabsTrigger
                          value="members"
                          className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6"
                        >
                          Danh sách sinh viên
                        </TabsTrigger>
                        <TabsTrigger
                          value="reviews"
                          className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-sm py-2 px-6"
                        >
                          Kết quả Đánh giá
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value="members"
                        className="space-y-3 outline-none mt-0"
                      >
                        {members.map((mem) => (
                          <MemberItem key={mem._id} mem={mem} />
                        ))}
                      </TabsContent>

                      <TabsContent
                        value="reviews"
                        className="outline-none mt-0"
                      >
                        <TeamReviewsTab teamId={team._id} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </TabsContent>

              {/* =========================================
                  TAB 2: GITHUB (Hiển thị full màn hình)
                  ========================================= */}
              <TabsContent
                value="github"
                className="outline-none mt-0 animate-in fade-in duration-500"
              >
                <TeamGithubTab teamId={teamId} />
              </TabsContent>

              {/* =========================================
                  TAB 3: JIRA (Hiển thị full màn hình)
                  ========================================= */}
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

// ... CÁC SUB-COMPONENTS BÊN DƯỚI ...
// ==========================================
function StatCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    orange:
      "bg-orange-50 dark:bg-orange-900/10 text-[#F27124] dark:text-orange-400",
    blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div
        className={cn(
          "inline-flex p-2 rounded-xl mb-2",
          colors[color as keyof typeof colors]
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
        {value || 0}
      </p>
    </div>
  );
}

function ConnectionRow({
  isConnected,
  label,
  subLabel,
  icon: Icon,
  colorClass,
}: any) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all w-full overflow-hidden",
        isConnected
          ? "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
          : "bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 opacity-60"
      )}
    >
      <div
        className={cn(
          "p-3 rounded-xl shadow-inner shrink-0",
          isConnected
            ? colorClass
            : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-1.5 truncate w-full block">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-black truncate w-full block",
            isConnected
              ? "text-slate-900 dark:text-slate-100"
              : "text-slate-300 dark:text-slate-600 italic"
          )}
        >
          {isConnected ? subLabel || "Đã kết nối" : "Chưa cấu hình"}
        </p>
      </div>
      {isConnected ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-900/20 shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
      )}
    </div>
  );
}

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
