"use client";

import { use } from "react";
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
} from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// --- HOOKS ---
import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import { useSyncProjectManual } from "@/features/lecturer/hooks/use-sync-team";
// --- TYPES ---
import {
  TeamDetailResponse,
  TeamMemberDetail,
} from "@/features/student/types/team-types";
import { TeamReviewsTab } from "@/features/management/classes/components/lecturer/team-reviews-tab";

export default function LecturerProjectDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const router = useRouter();
  const { teamId } = use(params);

  // Fetch dữ liệu nhóm
  const { data: detailData, isLoading } = useTeamDetail(teamId);
  const data = detailData as TeamDetailResponse | undefined;

  const team = data?.team;
  const project = data?.project;
  const members = data?.members || [];
  const stats = data?.stats;

  const githubUrl = project?.githubRepoUrl || team?.github_repo_url;
  const jiraKey = project?.jiraProjectKey || team?.jira_project_key;
  const jiraUrl = team?.jira_url;
  // Gọi Hook Sync thủ công
  const { mutate: syncData, isPending: isSyncing } = useSyncProjectManual(
    project?._id || "",
    teamId
  );
  return (
    <div className="min-h-screen bg-transparent font-sans pb-20 animate-in fade-in duration-500">
      {/* --- NÚT QUAY LẠI --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
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
                      <Clock className="w-3 h-3" /> Sync:{" "}
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

              {/* Action Buttons */}
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <Button
                  className="flex-1 md:flex-none h-12 px-6 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-sm transition-all"
                  disabled={!githubUrl}
                  onClick={() => githubUrl && window.open(githubUrl, "_blank")}
                >
                  <SiGithub className="w-4 h-4 mr-2" /> GitHub Repo
                </Button>
                <Button
                  className="flex-1 md:flex-none h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-sm transition-all"
                  disabled={!jiraKey && !jiraUrl}
                  onClick={() => {
                    const targetUrl =
                      jiraUrl || (jiraKey ? `https://id.atlassian.com/` : null);
                    if (targetUrl) window.open(targetUrl, "_blank");
                  }}
                >
                  <SiJira className="w-4 h-4 mr-2" /> Jira Board
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN: KÊNH TÍCH HỢP & STATS */}
              <div className="space-y-8 w-full overflow-hidden">
                {/* Stats Grid */}
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

                {/* Kênh đồng bộ */}
                <section className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm w-full overflow-hidden">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                    Kênh đồng bộ
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

              {/* RIGHT COLUMN: TABS CONTENT */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden flex flex-col">
                <Tabs
                  defaultValue="members"
                  className="w-full flex-1 flex flex-col"
                >
                  {/* Bọc TabsList và Nút Sync vào chung 1 hàng */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <TabsList className="w-full sm:w-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap h-auto">
                      <TabsTrigger
                        value="members"
                        className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all text-slate-500 py-2 px-4"
                      >
                        Thành viên
                      </TabsTrigger>
                      <TabsTrigger
                        value="reviews"
                        className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#F27124] data-[state=active]:shadow-md transition-all text-slate-500 py-2 px-4"
                      >
                        Đánh giá
                      </TabsTrigger>
                      <TabsTrigger
                        value="github"
                        className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md transition-all text-slate-500 py-2 px-4 flex items-center gap-1.5"
                      >
                        <SiGithub className="w-3 h-3" /> GitHub
                      </TabsTrigger>
                      <TabsTrigger
                        value="jira"
                        className="rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all text-slate-500 py-2 px-4 flex items-center gap-1.5"
                      >
                        <SiJira className="w-3 h-3" /> Jira
                      </TabsTrigger>
                    </TabsList>

                    {/* NÚT SYNC THỦ CÔNG */}
                    <Button
                      onClick={() => syncData()}
                      disabled={isSyncing || !project?._id}
                      className="w-full sm:w-auto bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm rounded-xl font-bold transition-all"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      {isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
                    </Button>
                  </div>

                  {/* NỘI DUNG CÁC TABS */}
                  <TabsContent
                    value="members"
                    className="space-y-3 outline-none mt-0"
                  >
                    {members.map((mem) => (
                      <MemberItem key={mem._id} mem={mem} />
                    ))}
                  </TabsContent>

                  <TabsContent value="reviews" className="outline-none mt-0">
                    <TeamReviewsTab teamId={team._id} />
                  </TabsContent>

                  {/* PLACEHOLDER CHO TAB GITHUB */}
                  <TabsContent
                    value="github"
                    className="outline-none mt-0 flex-1 flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl"
                  >
                    <div className="text-center">
                      <SiGithub className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                      <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Giao diện GitHub
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Sẽ thêm biểu đồ Commit và PRs vào đây.
                      </p>
                    </div>
                  </TabsContent>

                  {/* PLACEHOLDER CHO TAB JIRA */}
                  <TabsContent
                    value="jira"
                    className="outline-none mt-0 flex-1 flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl"
                  >
                    <div className="text-center">
                      <SiJira className="w-10 h-10 mx-auto text-blue-200 dark:text-blue-900/30 mb-3" />
                      <p className="text-sm font-bold text-blue-300 dark:text-blue-800 uppercase tracking-widest">
                        Bảng Kanban Jira
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Sẽ thêm danh sách Tasks và Sprints vào đây.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SUB COMPONENTS
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
