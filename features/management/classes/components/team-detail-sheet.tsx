"use client";

import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Github,
  Trello,
  GitCommit,
  ListTodo,
  Users,
  History,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Crown,
} from "lucide-react";
import { format } from "date-fns";
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
  const { data: detailData, isLoading } = useTeamDetail(open ? teamId : null);

  const team = detailData?.team;
  const members = detailData?.members || [];
  const stats = detailData?.stats;

  // Helper render trạng thái kết nối
  const ConnectionStatus = ({
    isConnected,
    label,
    icon: Icon,
    colorClass,
  }: any) => (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-all",
        isConnected
          ? "bg-white border-gray-200"
          : "bg-gray-50 border-dashed border-gray-200 opacity-70",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg",
          isConnected ? colorClass : "bg-gray-200 text-gray-500",
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-semibold",
            isConnected ? "text-gray-900" : "text-gray-400",
          )}
        >
          {isConnected ? "Đã kết nối" : "Chưa cấu hình"}
        </p>
      </div>
      {isConnected && <CheckCircle2 className="w-5 h-5 text-green-500" />}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 bg-white shadow-2xl flex flex-col h-full">
        {/* --- HEADER --- */}
        <SheetHeader className="px-6 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-gray-200"
              >
                Team Detail
              </Badge>
              {team?.last_sync_at && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sync:{" "}
                  {format(new Date(team.last_sync_at), "HH:mm dd/MM")}
                </span>
              )}
            </div>
            <SheetTitle className="text-2xl font-black text-gray-900 leading-tight">
              {isLoading
                ? "Đang tải dữ liệu..."
                : team?.project_name || "Chi tiết nhóm"}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* --- BODY --- */}
        <ScrollArea className="flex-1 bg-gray-50/30">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 min-h-[400px]">
              <Loader2 className="w-10 h-10 animate-spin text-[#F27124]" />
              <p className="text-sm text-gray-400 font-medium">
                Đang đồng bộ dữ liệu nhóm...
              </p>
            </div>
          ) : !team ? (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy thông tin nhóm.
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {/* 1. KEY METRICS (GRID 2x2) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-orange-100 rounded-md text-[#F27124]">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Thành viên
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">
                    {stats?.members || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                      <GitCommit className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Commits
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">
                    {stats?.commits || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-600">
                      <ListTodo className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Tasks
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">
                    {stats?.tasks || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-purple-100 rounded-md text-purple-600">
                      <History className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Sprints
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">
                    {stats?.sprints || 0}
                  </p>
                </div>
              </div>

              {/* 2. INTEGRATION STATUS */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Trạng thái tích hợp
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <ConnectionStatus
                    isConnected={!!team.github_repo_url}
                    label="GitHub Repository"
                    icon={Github}
                    colorClass="bg-gray-900 text-white"
                  />
                  <ConnectionStatus
                    isConnected={!!team.jira_project_key}
                    label="Jira Software"
                    icon={Trello}
                    colorClass="bg-blue-600 text-white"
                  />
                </div>
              </div>

              {/* 3. TABS: MEMBERS & HISTORY */}
              <Tabs defaultValue="members" className="w-full">
                <TabsList className="w-full bg-gray-100 p-1 rounded-xl mb-4">
                  <TabsTrigger
                    value="members"
                    className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Thành viên ({members.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Lịch sử Sync
                  </TabsTrigger>
                </TabsList>

                {/* TAB MEMBERS */}
                <TabsContent
                  value="members"
                  className="space-y-3 animate-in fade-in slide-in-from-bottom-2"
                >
                  {members.map((mem) => (
                    <div
                      key={mem._id}
                      className="group flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-orange-200 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={mem.student_id.avatar_url} />
                          <AvatarFallback className="bg-orange-50 text-orange-600 text-xs font-bold">
                            {mem.student_id.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">
                              {mem.student_id.full_name}
                            </p>
                            {mem.role_in_team === "Leader" && (
                              <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 text-[9px] px-1.5 py-0 h-4 gap-1 hover:bg-yellow-100">
                                <Crown className="w-3 h-3 fill-yellow-600" />{" "}
                                LEADER
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            {mem.student_id.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                          {mem.student_id.student_code}
                        </p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* TAB HISTORY */}
                <TabsContent
                  value="history"
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2"
                >
                  {!team.sync_history || team.sync_history.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                      Chưa có lịch sử đồng bộ nào.
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pl-6 py-2">
                      {team.sync_history
                        .slice(0, 5)
                        .map((log: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-sm" />
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                Đồng bộ thành công
                                {idx === 0 && (
                                  <Badge className="text-[9px] h-4 bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                    Latest
                                  </Badge>
                                )}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(
                                  new Date(log.synced_at),
                                  "HH:mm, dd/MM/yyyy",
                                )}
                              </span>

                              <div className="mt-2 bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 border border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Github className="w-3 h-3" />
                                  <span>
                                    Git: <b>{log.stats?.git || 0}</b>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Trello className="w-3 h-3" />
                                  <span>
                                    Task: <b>{log.stats?.jira_tasks || 0}</b>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* FOOTER ACTIONS */}
              <Separator />
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#F27124] hover:bg-[#d65d1b] text-white font-bold rounded-xl"
                  disabled={!team.github_repo_url}
                  onClick={() =>
                    team.github_repo_url &&
                    window.open(team.github_repo_url, "_blank")
                  }
                >
                  <Github className="w-4 h-4 mr-2" /> Mở GitHub
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                  disabled={!team.jira_url}
                  onClick={() =>
                    team.jira_url && window.open(team.jira_url, "_blank")
                  }
                >
                  <Trello className="w-4 h-4 mr-2" /> Mở Jira
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
