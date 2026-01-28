"use client";

import {
  Loader2,
  AlertCircle,
  Users,
  GitCommit,
  ListTodo,
  History,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Clock,
} from "lucide-react";
import { SiGithub, SiJira } from "react-icons/si";
import { format } from "date-fns";

import { useProjectDetail } from "../hooks/use-project-detail";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  // Gọi Hook lấy dữ liệu từ endpoint /api/projects/teams/{teamId}
  const { data, isLoading, isError } = useProjectDetail(open ? teamId : null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col h-full font-mono bg-white border-l border-slate-200 shadow-2xl overflow-hidden">
        {/* --- TRẠNG THÁI LOADING --- */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-white">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-[#F27124] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-[#F27124] rounded-full animate-ping" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
              SYNCING_REMOTE_DATA...
            </p>
          </div>
        )}

        {/* --- TRẠNG THÁI LỖI (403/404) --- */}
        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4">
            <div className="p-4 bg-red-50 rounded-3xl">
              <AlertCircle className="w-10 h-10 text-red-500 opacity-40" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black uppercase text-slate-900 tracking-tighter">
                ACCESS_DENIED_ERROR
              </h3>
              <p className="text-xs text-slate-400 font-medium max-w-[280px] mx-auto uppercase">
                Bạn không có quyền xem thông tin này hoặc teamId không tồn tại.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mt-4 rounded-xl font-bold uppercase text-[10px] tracking-widest border-slate-200"
            >
              Back_To_Dashboard
            </Button>
          </div>
        )}

        {/* --- HIỂN THỊ DỮ LIỆU KHI THÀNH CÔNG --- */}
        {!isLoading && !isError && data && (
          <>
            <SheetHeader className="px-8 py-8 border-b border-slate-100 bg-white shrink-0 z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#F27124]/10 text-[#F27124] border-none font-black uppercase text-[9px] tracking-[0.2em] px-3">
                    Team_Profile // {data.team._id.slice(-6).toUpperCase()}
                  </Badge>
                  {data.team.last_sync_at && (
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Last_Sync:{" "}
                      {format(
                        new Date(data.team.last_sync_at),
                        "HH:mm dd/MM/yy",
                      )}
                    </span>
                  )}
                </div>
                <SheetTitle className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                  {data.team.project_name}
                </SheetTitle>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 bg-slate-50/30">
              <div className="p-8 space-y-12 pb-20">
                {/* 1. Bento Grid Stats */}
                <section className="grid grid-cols-2 gap-4">
                  <StatCard
                    label="Thành viên"
                    value={data.stats.members}
                    icon={Users}
                    color="orange"
                  />
                  <StatCard
                    label="Git_Commits"
                    value={data.stats.commits}
                    icon={GitCommit}
                    color="blue"
                  />
                  <StatCard
                    label="Jira_Tasks"
                    value={data.stats.tasks}
                    icon={ListTodo}
                    color="emerald"
                  />
                  <StatCard
                    label="Total_Sprints"
                    value={data.stats.sprints}
                    icon={History}
                    color="purple"
                  />
                </section>

                {/* 2. Kênh tích hợp */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">
                    Kênh_Tích_Hợp
                  </h3>
                  <div className="grid gap-3">
                    <ConnectionRow
                      isConnected={!!data.team.github_repo_url}
                      label="GitHub_Source"
                      icon={SiGithub}
                      colorClass="bg-slate-900 text-white"
                    />
                    <ConnectionRow
                      isConnected={!!data.team.jira_project_key}
                      label="Jira_Software"
                      icon={SiJira}
                      colorClass="bg-blue-600 text-white"
                    />
                  </div>
                </section>

                {/* 3. Danh sách thành viên */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">
                    Team_Members
                  </h3>
                  <div className="space-y-3">
                    {data.members.map((mem) => (
                      <MemberItem key={mem._id} mem={mem} />
                    ))}
                  </div>
                </section>

                {/* 4. Lịch sử đồng bộ */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">
                    Latest_Sync_History
                  </h3>
                  <SyncHistoryLogs history={data.team.sync_history} />
                </section>
              </div>
            </ScrollArea>

            {/* Footer: Sticky Actions */}
            <div className="p-6 border-t border-slate-100 bg-white shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-20">
              <div className="flex gap-4">
                <Button
                  className="flex-1 h-12 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest"
                  disabled={!data.team.github_repo_url}
                  onClick={() =>
                    window.open(data.team.github_repo_url, "_blank")
                  }
                >
                  <SiGithub className="w-4 h-4 mr-3" /> GitHub
                </Button>
                <Button
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase text-xs tracking-widest"
                  disabled={!data.team.jira_url}
                  onClick={() => window.open(data.team.jira_url, "_blank")}
                >
                  <SiJira className="w-4 h-4 mr-3" /> Jira_Dev
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// --- SUB-COMPONENTS (TÍNH NĂNG CON) ---

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    orange: "bg-orange-50 text-[#F27124]",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md group">
      <div
        className={cn(
          "inline-flex p-2.5 rounded-2xl mb-3 group-hover:rotate-6 transition-transform",
          colors[color as keyof typeof colors],
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
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
        "flex items-center gap-4 p-4 rounded-[24px] border transition-all",
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
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-black uppercase",
            isConnected ? "text-slate-900" : "text-slate-300",
          )}
        >
          {isConnected ? "CONNECTED" : "NOT_CONFIGURED"}
        </p>
      </div>
      {isConnected && (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
      )}
    </div>
  );
}

function MemberItem({ mem }: any) {
  return (
    <div className="group flex items-center justify-between p-4 bg-white rounded-[24px] border border-slate-100 hover:border-[#F27124]/20 transition-all">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
          <AvatarImage src={mem.student_id.avatar_url} />
          <AvatarFallback className="bg-slate-50 text-slate-400 font-black">
            {mem.student_id.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
              {mem.student_id.full_name}
            </p>
            {mem.role_in_team === "Leader" && (
              <Badge className="bg-yellow-400 text-yellow-900 border-none text-[8px] font-black uppercase h-4 px-1.5">
                LEADER
              </Badge>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">
            {mem.student_id.student_code} // {mem.student_id.email}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-[#F27124] transition-colors" />
    </div>
  );
}

function SyncHistoryLogs({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-10 text-slate-300 italic font-black uppercase text-[10px] tracking-widest">
        NO_SYNC_HISTORY_FOUND
      </div>
    );
  }
  return (
    <div className="space-y-6 ml-3 border-l-2 border-slate-100 pl-8 py-2 relative">
      {history.slice(0, 5).map((log, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[37px] top-1 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                SUCCESSFUL_SYNC
                {idx === 0 && (
                  <Badge className="text-[8px] font-black h-4 bg-emerald-100 text-emerald-600 border-none">
                    LATEST
                  </Badge>
                )}
              </p>
              <span className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {format(new Date(log.synced_at), "HH:mm // dd.MM.yyyy")}
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 grid grid-cols-2 gap-4 border border-slate-100 shadow-sm hover:border-emerald-100 transition-all">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase">
                <SiGithub className="w-3.5 h-3.5 text-slate-400" /> Commits:{" "}
                <span className="text-[#F27124]">{log.stats?.git || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase">
                <SiJira className="w-3.5 h-3.5 text-blue-400" /> Tasks:{" "}
                <span className="text-[#F27124]">
                  {log.stats?.jira_tasks || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
