"use client";

import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  GitCommit,
  ListTodo,
  Users,
  History,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SiGithub, SiJira } from "react-icons/si";
import {
  TeamDetailResponse,
  TeamMemberDetail,
  SyncHistoryLog,
} from "@/features/student/types/team-types";

// IMPORT COMPONENT VỪA TÁCH
import { TeamReviewsTab } from "@/features/management/classes/components/lecturer/team-reviews-tab";

interface TeamDetailSheetProps {
  teamId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamDetailSheet({
  teamId,
  open,
  onOpenChange,
}: TeamDetailSheetProps) {
  const { data: detailData, isLoading } = useTeamDetail(open ? teamId : null);
  const data = detailData as TeamDetailResponse | undefined;

  // 👇 CẬP NHẬT: Lấy thêm dữ liệu project từ response mới của BE
  const team = data?.team;
  const project = data?.project;
  const members = data?.members || [];
  const stats = data?.stats;

  // 👇 Ưu tiên lấy field từ project, nếu không có mới fallback về team
  const githubUrl = project?.githubRepoUrl || team?.github_repo_url;
  const jiraKey = project?.jiraProjectKey || team?.jira_project_key;
  const jiraUrl = team?.jira_url;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 bg-white dark:bg-slate-950 flex flex-col h-[100dvh] overflow-hidden border-l border-slate-200 dark:border-slate-800 shadow-2xl font-sans">
        {/* --- HEADER --- */}
        <SheetHeader className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 z-10 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-orange-50 dark:bg-orange-900/10 text-[#F27124] dark:text-orange-400 border-orange-100 dark:border-orange-900/30 font-black uppercase text-[10px] tracking-widest"
              >
                Team Profile
              </Badge>
              {team?.last_sync_at && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" /> Sync:{" "}
                  {format(new Date(team.last_sync_at), "HH:mm dd/MM")}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <SheetTitle className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter leading-tight">
                {isLoading ? "Đang tải dữ liệu..." : team?.project_name}
              </SheetTitle>
              {team?.class_id && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Lớp:{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {team.class_id.name}
                  </span>{" "}
                  • Môn:{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {team.class_id.subject_id?.code}
                  </span>
                </p>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* --- BODY --- */}
        <div className="flex-1 bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#F27124] opacity-20" />
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
                Đang nạp dữ liệu nhóm...
              </p>
            </div>
          ) : !team ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
              Không tìm thấy thông tin.
            </div>
          ) : (
            <div className="p-6 space-y-10 pb-10">
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

              {/* Integration Status */}
              <section className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                  Kênh tích hợp
                </h3>
                <div className="grid gap-3">
                  <ConnectionRow
                    isConnected={!!githubUrl} // Đã update biến
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
                    isConnected={!!jiraKey} // Đã update biến
                    label="Jira Workspace"
                    subLabel={jiraKey ? `Key: ${jiraKey}` : undefined}
                    icon={SiJira}
                    colorClass="bg-blue-600 text-white"
                  />
                </div>
              </section>

              {/* Tabs Content */}
              <Tabs defaultValue="members" className="w-full">
                <TabsList className="w-full bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl mb-6 border border-slate-200 dark:border-slate-800">
                  <TabsTrigger
                    value="members"
                    className="flex-1 rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-md transition-all text-slate-500 dark:text-slate-400"
                  >
                    Thành viên
                  </TabsTrigger>

                  <TabsTrigger
                    value="reviews"
                    className="flex-1 rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#F27124] dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-md transition-all text-slate-500 dark:text-slate-400"
                  >
                    Đánh giá
                  </TabsTrigger>

                  <TabsTrigger
                    value="history"
                    className="flex-1 rounded-xl text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-md transition-all text-slate-500 dark:text-slate-400"
                  >
                    Lịch sử Sync
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-3 outline-none">
                  {members.map((mem) => (
                    <MemberItem key={mem._id} mem={mem} />
                  ))}
                </TabsContent>

                {/* GỌI COMPONENT ĐÃ ĐƯỢC TÁCH Ở ĐÂY */}
                <TabsContent value="reviews" className="outline-none">
                  <TeamReviewsTab teamId={team._id} />
                </TabsContent>

                <TabsContent value="history" className="outline-none">
                  <SyncHistoryLogs history={team.sync_history} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        {!isLoading && team && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] dark:shadow-none">
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-black rounded-2xl shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-95"
                disabled={!githubUrl} // Đã update biến
                onClick={() => githubUrl && window.open(githubUrl, "_blank")}
              >
                <SiGithub className="w-4 h-4 mr-2" /> GitHub Repo
              </Button>
              <Button
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95"
                disabled={!jiraKey && !jiraUrl} // Đã update biến
                onClick={() => {
                  const targetUrl =
                    jiraUrl || (jiraKey ? `https://id.atlassian.com/` : null); // Fallback tạm nếu không có base URL
                  if (targetUrl) window.open(targetUrl, "_blank");
                }}
              >
                <SiJira className="w-4 h-4 mr-2" /> Jira Board
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// --- SUB COMPONENTS ---

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
    <div className="bg-white dark:bg-slate-900 p-4 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div
        className={cn(
          "inline-flex p-2 rounded-xl mb-2",
          colors[color as keyof typeof colors],
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
        "flex items-center gap-4 p-4 rounded-3xl border transition-all",
        isConnected
          ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
          : "bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-700 opacity-60",
      )}
    >
      <div
        className={cn(
          "p-3 rounded-2xl shadow-inner",
          isConnected
            ? colorClass
            : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-1.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-black truncate",
            isConnected
              ? "text-slate-900 dark:text-slate-100"
              : "text-slate-300 dark:text-slate-600 italic",
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
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-11 w-11 rounded-2xl border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <AvatarImage src={student?.avatar_url || ""} />
          <AvatarFallback className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black">
            {student?.full_name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-sm font-black tracking-tight leading-none",
                student
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-400 dark:text-slate-600 italic",
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
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1.5">
              {student.email}
            </p>
          )}
        </div>
      </div>
      {student && (
        <Badge
          variant="outline"
          className="font-mono text-[10px] text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 px-2 bg-slate-50 dark:bg-slate-800"
        >
          {student.student_code}
        </Badge>
      )}
    </div>
  );
}

function SyncHistoryLogs({ history }: { history: SyncHistoryLog[] }) {
  if (!history || history.length === 0)
    return (
      <div className="text-center py-12 text-slate-300 dark:text-slate-600 italic font-bold">
        Chưa có lịch sử đồng bộ.
      </div>
    );
  const sortedHistory = [...history].reverse();
  return (
    <div className="space-y-6 ml-3 border-l-2 border-slate-100 dark:border-slate-800 pl-6 py-2 relative">
      {sortedHistory.slice(0, 5).map((log, idx) => (
        <div key={idx} className="relative group">
          <div
            className={cn(
              "absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white dark:border-slate-950 shadow-sm",
              log.sync_errors && log.sync_errors.length > 0
                ? "bg-red-500"
                : "bg-emerald-500",
            )}
          />
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {log.sync_errors && log.sync_errors.length > 0
                  ? "Đồng bộ có lỗi"
                  : "Đồng bộ Thành công"}
                {idx === 0 && (
                  <Badge className="text-[9px] font-black h-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-none">
                    Mới nhất
                  </Badge>
                )}
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {format(new Date(log.synced_at), "HH:mm dd/MM")}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 grid grid-cols-3 gap-3 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30 transition-all">
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <SiGithub className="w-4 h-4 text-slate-700 dark:text-slate-300 mb-1" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Commits
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {log.stats?.git || 0}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <SiJira className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-[10px] font-bold text-blue-400 dark:text-blue-500">
                  Tasks
                </span>
                <span className="text-sm font-black text-blue-700 dark:text-blue-300">
                  {log.stats?.jira_tasks || 0}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                <History className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-[10px] font-bold text-purple-400 dark:text-purple-500">
                  Sprints
                </span>
                <span className="text-sm font-black text-purple-700 dark:text-purple-300">
                  {log.stats?.jira_sprints || 0}
                </span>
              </div>
            </div>
            {log.sync_errors && log.sync_errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <ShieldAlert className="w-3 h-3" /> Chi tiết lỗi:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {log.sync_errors.map((err: any, i: number) => (
                    <li key={i}>
                      {typeof err === "string" ? err : JSON.stringify(err)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
