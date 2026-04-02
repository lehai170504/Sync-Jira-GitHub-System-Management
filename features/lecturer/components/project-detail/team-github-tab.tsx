"use client";

import { useState, useEffect } from "react";
import { useTeamCommits } from "@/features/lecturer/hooks/use-integration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Github,
  GitBranch,
  ExternalLink,
  GitCommit,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TeamGithubTabProps {
  teamId: string;
}

export function TeamGithubTab({ teamId }: TeamGithubTabProps) {
  const { data, isLoading } = useTeamCommits(teamId);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Tự động chọn thành viên đầu tiên khi load xong data
  useEffect(() => {
    if (data?.members_commits?.length > 0 && !selectedMemberId) {
      const firstId = data.members_commits[0].member?._id || "unassigned";
      setSelectedMemberId(firstId);
    }
  }, [data, selectedMemberId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Đang đồng bộ kho lưu trữ...
        </p>
      </div>
    );
  }

  if (!data || !data.members_commits || data.members_commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center">
        <Github className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-700 dark:text-slate-300">
          Chưa có dữ liệu Commit
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mt-2">
          Nhóm chưa đẩy code lên GitHub hoặc tài khoản chưa được ánh xạ đúng.
        </p>
      </div>
    );
  }

  // Tìm data của thành viên đang được chọn
  const activeMemberData =
    data.members_commits.find((m: any) => {
      const mId = m.member?._id || "unassigned";
      return mId === selectedMemberId;
    }) || data.members_commits[0];

  const activeStudent = activeMemberData?.member?.student;
  const activeCommits = activeMemberData?.commits || [];
  const isUnassignedActive = !activeMemberData?.member;

  return (
    <div className="flex flex-col h-[700px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      {/* Tab Header */}
      <div className="shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 dark:bg-slate-100 rounded-2xl">
            <Github className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Lịch sử Commits
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-none font-bold"
              >
                {data.summary?.total_commits || 0} Commits Toàn Đội
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Sidebar: Danh sách thành viên */}
        <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50">
          <div className="p-3 space-y-2 overflow-y-auto h-full">
            {data.members_commits.map((memberData: any, idx: number) => {
              const student = memberData.member?.student;
              const isUnassigned = !memberData.member;
              const currentId = isUnassigned
                ? "unassigned"
                : memberData.member._id;
              const isSelected = selectedMemberId === currentId;

              return (
                <button
                  key={currentId + idx}
                  onClick={() => setSelectedMemberId(currentId)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-2xl transition-all border",
                    isSelected
                      ? "bg-white dark:bg-slate-800 border-blue-500/50 shadow-sm ring-1 ring-blue-500/10"
                      : "bg-transparent border-transparent hover:bg-white/60",
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar
                      className={cn(
                        "h-10 w-10 border-2",
                        isSelected ? "border-blue-500" : "border-white",
                      )}
                    >
                      <AvatarImage src={student?.avatar_url} />
                      <AvatarFallback
                        className={isUnassigned ? "bg-red-50 text-red-500" : ""}
                      >
                        {isUnassigned ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          student?.full_name?.charAt(0)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 text-left">
                      <p
                        className={cn(
                          "text-sm font-bold truncate",
                          isSelected
                            ? "text-blue-700"
                            : "text-slate-900 dark:text-slate-100",
                        )}
                      >
                        {isUnassigned ? "Commits Ẩn danh" : student?.full_name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        {isUnassigned
                          ? "Chưa map GitHub"
                          : student?.student_code}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                      {
                        memberData.commits?.filter((c: any) => c.is_counted)
                          .length
                      }
                      /{memberData.total_commits}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content: Danh sách Commit chi tiết */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <Badge
              variant="outline"
              className="text-sm font-bold py-1 bg-slate-50"
            >
              {isUnassignedActive
                ? "Danh sách chưa định danh"
                : activeStudent?.full_name}
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="relative pl-8 space-y-8">
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

              {activeCommits.length === 0 ? (
                <p className="text-center text-slate-400 py-10">
                  Thành viên này chưa có commit nào.
                </p>
              ) : (
                activeCommits.map((commit: any) => (
                  <div key={commit._id} className="relative group">
                    <div
                      className={cn(
                        "absolute -left-[38px] top-1.5 h-4 w-4 rounded-full ring-4 ring-white dark:ring-slate-950 z-10",
                        commit.is_counted
                          ? "bg-emerald-500 shadow-[0_0_8px_emerald]"
                          : "bg-slate-300",
                      )}
                    />

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-300 transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed mb-3">
                            {commit.message}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] gap-1 bg-slate-50"
                            >
                              <GitBranch className="w-3 h-3" />{" "}
                              {commit.branch || "main"}
                            </Badge>
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                              <Clock className="w-3 h-3" />{" "}
                              {format(
                                new Date(commit.commit_date),
                                "HH:mm dd/MM/yyyy",
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2">
                          <a
                            href={commit.url}
                            target="_blank"
                            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                          >
                            {commit.hash.substring(0, 7)}{" "}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {commit.is_counted ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-slate-500"
                            >
                              <XCircle className="w-3 h-3" /> Bỏ qua
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!commit.is_counted && commit.rejection_reason && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                            {commit.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
