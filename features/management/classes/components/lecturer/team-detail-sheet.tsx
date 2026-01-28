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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  GitCommit,
  ListTodo,
  Users,
  History,
  Clock,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SiGithub, SiJira } from "react-icons/si";

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

  const team = detailData?.team;
  const members = detailData?.members || [];
  const stats = detailData?.stats;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 bg-white flex flex-col h-[100dvh] overflow-hidden border-l border-slate-200 shadow-2xl">
        {/* --- HEADER (Cố định ở trên) --- */}
        <SheetHeader className="px-6 py-6 border-b border-gray-100 bg-white z-10 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-orange-50 text-[#F27124] border-orange-100 font-black uppercase text-[10px] tracking-widest"
              >
                Team Profile
              </Badge>
              {team?.last_sync_at && (
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" /> Sync:{" "}
                  {format(new Date(team.last_sync_at), "HH:mm dd/MM")}
                </span>
              )}
            </div>
            <SheetTitle className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">
              {isLoading ? "Đang tải dữ liệu..." : team?.project_name}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* --- BODY (Vùng có thể cuộn) --- */}
        <ScrollArea className="flex-1 bg-slate-50/30">
          {isLoading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#F27124] opacity-20" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
                Đang nạp dữ liệu nhóm...
              </p>
            </div>
          ) : !team ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest">
              Không tìm thấy thông tin.
            </div>
          ) : (
            <div className="p-6 space-y-10 pb-10">
              {/* Thống kê Bento Grid */}
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

              {/* Tích hợp công cụ */}
              <section className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Kênh tích hợp
                </h3>
                <div className="grid gap-3">
                  <ConnectionRow
                    isConnected={!!team.github_repo_url}
                    label="GitHub Repo"
                    icon={SiGithub}
                    colorClass="bg-slate-900 text-white"
                  />
                  <ConnectionRow
                    isConnected={!!team.jira_project_key}
                    label="Jira Workspace"
                    icon={SiJira}
                    colorClass="bg-blue-600 text-white"
                  />
                </div>
              </section>

              {/* Tabs dữ liệu chi tiết */}
              <Tabs defaultValue="members" className="w-full">
                <TabsList className="w-full bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200">
                  <TabsTrigger
                    value="members"
                    className="flex-1 rounded-xl text-xs font-black data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                  >
                    Thành viên
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex-1 rounded-xl text-xs font-black data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                  >
                    Lịch sử Sync
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-3 outline-none">
                  {members.map((mem) => (
                    <MemberItem key={mem._id} mem={mem} />
                  ))}
                </TabsContent>

                <TabsContent value="history" className="outline-none">
                  <SyncHistoryLogs history={team.sync_history} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </ScrollArea>

        {/* --- FOOTER (Cố định ở dưới) --- */}
        {!isLoading && team && (
          <div className="p-6 border-t border-slate-100 bg-white shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-95"
                disabled={!team.github_repo_url}
                onClick={() =>
                  team.github_repo_url &&
                  window.open(team.github_repo_url, "_blank")
                }
              >
                <SiGithub className="w-4 h-4 mr-2" /> GitHub
              </Button>
              <Button
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                disabled={!team.jira_url}
                onClick={() =>
                  team.jira_url && window.open(team.jira_url, "_blank")
                }
              >
                <SiJira className="w-4 h-4 mr-2" /> Jira
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** * Các Component con giúp code sạch hơn và quản lý cuộn tốt hơn
 */

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    orange: "bg-orange-50 text-[#F27124]",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div
        className={cn(
          "inline-flex p-2 rounded-xl mb-2",
          colors[color as keyof typeof colors],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
        {value || 0}
      </p>
    </div>
  );
}

function ConnectionRow({ isConnected, label, icon: Icon, colorClass }: any) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-3xl border transition-all",
        isConnected
          ? "bg-white border-slate-100"
          : "bg-slate-50 border-dashed border-slate-200 opacity-60",
      )}
    >
      <div
        className={cn(
          "p-3 rounded-2xl shadow-inner",
          isConnected ? colorClass : "bg-slate-200 text-slate-400",
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-black",
            isConnected ? "text-slate-900" : "text-slate-300 italic",
          )}
        >
          {isConnected ? "Hoạt động" : "Chưa kết nối"}
        </p>
      </div>
      {isConnected && (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
      )}
    </div>
  );
}

function MemberItem({ mem }: any) {
  if (!mem?.student_id) return null;

  const student = mem.student_id;
  return (
    <div className="group flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 hover:border-orange-200 transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-11 w-11 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
          <AvatarImage src={student?.avatar_url} />
          <AvatarFallback className="bg-slate-50 text-slate-400 font-black">
            {student?.full_name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-slate-900 tracking-tight leading-none">
              {student?.full_name || "N/A"}
            </p>
            {mem.role_in_team === "Leader" && (
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 border-none text-[9px] font-black uppercase px-2 py-0 h-4">
                Nhóm trưởng
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1.5">
            {student?.email || "No email"}
          </p>
        </div>
      </div>
      <Badge
        variant="outline"
        className="font-mono text-[10px] text-slate-400 border-slate-100 px-2"
      >
        {student?.student_code || "No ID"}
      </Badge>
    </div>
  );
}

function SyncHistoryLogs({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 text-slate-300 italic font-bold">
        Chưa có dữ liệu đồng bộ.
      </div>
    );
  }
  return (
    <div className="space-y-6 ml-3 border-l-2 border-slate-100 pl-6 py-2 relative">
      {history.slice(0, 5).map((log, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-900 flex items-center gap-2">
              Đồng bộ Thành công
              {idx === 0 && (
                <Badge className="text-[9px] font-black h-4 bg-emerald-50 text-emerald-600 border-none">
                  Mới nhất
                </Badge>
              )}
            </p>
            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-300" />{" "}
              {format(new Date(log.synced_at), "HH:mm, dd/MM/yyyy")}
            </p>
            <div className="bg-white rounded-2xl p-3 grid grid-cols-2 gap-3 border border-slate-100 shadow-sm group-hover:border-emerald-100 transition-all">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                <SiGithub className="w-3 h-3 text-slate-400" /> Commit:{" "}
                {log.stats?.git || 0}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                <SiJira className="w-3 h-3 text-blue-400" /> Tasks:{" "}
                {log.stats?.jira_tasks || 0}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
