"use client";

import {
  Loader2,
  AlertCircle,
  Users,
  GitCommit,
  ListTodo,
  History,
  CheckCircle2,
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

import { StatCard } from "./stat-card"; // Tái sử dụng StatCard

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
  const { data, isLoading, isError } = useProjectDetail(open ? teamId : null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-150 p-0 flex flex-col h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl font-sans transition-colors">
        {/* --- TRẠNG THÁI LOADING --- */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
              Đang đồng bộ dữ liệu đồ án...
            </p>
          </div>
        )}

        {/* --- TRẠNG THÁI LỖI --- */}
        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4 dark:bg-slate-950">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">
                Lỗi truy cập
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Dữ liệu không tồn tại hoặc bạn không có quyền xem thông tin nhóm
                này.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mt-4 rounded-xl border-slate-200 dark:border-slate-800"
            >
              Đóng
            </Button>
          </div>
        )}

        {/* --- DỮ LIỆU --- */}
        {!isLoading && !isError && data && (
          <>
            <SheetHeader className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 z-10 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none font-bold uppercase text-[10px] tracking-wider px-3 py-1"
                  >
                    Nhóm {data.team._id.slice(-6)}
                  </Badge>
                  {data.team.last_sync_at && (
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Đồng bộ:{" "}
                      {format(new Date(data.team.last_sync_at), "HH:mm dd/MM")}
                    </span>
                  )}
                </div>
                <SheetTitle className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                  {data.team.project_name}
                </SheetTitle>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="p-6 md:p-8 space-y-10 pb-20">
                {/* 1. Stats */}
                <section className="grid grid-cols-2 gap-4">
                  <StatCard
                    label="Thành viên"
                    value={data.stats.members}
                    icon={<Users className="w-5 h-5" />}
                    color="blue"
                  />
                  <StatCard
                    label="Jira Tasks"
                    value={data.stats.tasks}
                    icon={<ListTodo className="w-5 h-5" />}
                    color="emerald"
                  />
                  <StatCard
                    label="Git Commits"
                    value={data.stats.commits}
                    icon={<GitCommit className="w-5 h-5" />}
                    color="orange"
                  />
                  <StatCard
                    label="Sprints"
                    value={data.stats.sprints}
                    icon={<History className="w-5 h-5" />}
                    color="purple"
                  />
                </section>

                {/* 2. Integrations */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Kênh Tích Hợp
                  </h3>
                  <div className="grid gap-3">
                    <ConnectionRow
                      isConnected={!!data.team.github_repo_url}
                      label="GitHub Repository"
                      icon={SiGithub}
                      url={data.team.github_repo_url}
                    />
                    <ConnectionRow
                      isConnected={!!data.team.jira_project_key}
                      label="Jira Software"
                      icon={SiJira}
                      url={data.team.jira_url}
                    />
                  </div>
                </section>

                {/* 3. Members */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Thành viên nhóm
                  </h3>
                  <div className="grid gap-3">
                    {data.members.map((mem) => (
                      <MemberItem key={mem._id} mem={mem} />
                    ))}
                  </div>
                </section>

                {/* 4. Sync History */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Lịch sử đồng bộ
                  </h3>
                  <SyncHistoryLogs history={data.team.sync_history} />
                </section>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// --- SUB-COMPONENTS ---

function ConnectionRow({ isConnected, label, icon: Icon, url }: any) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl border transition-colors",
        isConnected
          ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          : "bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800 opacity-70",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {label}
          </p>
          <p
            className={cn(
              "text-xs font-medium mt-0.5",
              isConnected
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400",
            )}
          >
            {isConnected ? "Đã kết nối" : "Chưa cấu hình"}
          </p>
        </div>
      </div>
      {isConnected && url && (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 dark:text-blue-400"
          asChild
        >
          <a href={url} target="_blank" rel="noreferrer">
            Mở Link
          </a>
        </Button>
      )}
    </div>
  );
}

function MemberItem({ mem }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
          <AvatarImage src={mem.student_id.avatar_url} />
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
            {mem.student_id.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {mem.student_id.full_name}
            </p>
            {mem.role_in_team === "Leader" && (
              <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-none text-[10px] font-bold px-2 py-0">
                Leader
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {mem.student_id.student_code}
          </p>
        </div>
      </div>
    </div>
  );
}

function SyncHistoryLogs({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400 italic text-sm font-medium bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        Chưa có dữ liệu đồng bộ
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {history.slice(0, 5).map((log, idx) => (
        <div key={idx} className="flex gap-4 items-start">
          {/* Timeline Dot */}
          <div className="flex flex-col items-center mt-1">
            <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/20" />
            {idx !== history.slice(0, 5).length - 1 && (
              <div className="h-full w-px bg-slate-200 dark:bg-slate-800 mt-2 min-h-10" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              {format(new Date(log.synced_at), "HH:mm - dd/MM/yyyy")}
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <SiGithub className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {log.stats?.git || 0}
                </span>{" "}
                Commits
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <SiJira className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {log.stats?.jira_tasks || 0}
                </span>{" "}
                Tasks
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
