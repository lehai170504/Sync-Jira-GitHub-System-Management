"use client";

import { useState, useEffect } from "react";
import { useTeamCommits } from "@/features/lecturer/hooks/use-integration";
import {
  Loader2,
  GitCommit,
  ExternalLink,
  CheckCircle2,
  XCircle,
  GitBranch,
  Github,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TeamGithubTab({ teamId }: { teamId: string }) {
  const { data, isLoading } = useTeamCommits(teamId);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (
      data?.members_commits &&
      data.members_commits.length > 0 &&
      !selectedMemberId
    ) {
      setSelectedMemberId(data.members_commits[0].member._id);
    }
  }, [data, selectedMemberId]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[700px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
          Đang đồng bộ kho lưu trữ...
        </p>
      </div>
    );

  if (!data || !data.members_commits || data.members_commits.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[700px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 p-6 text-center">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Github className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg font-black text-slate-700 dark:text-slate-300 mb-2">
          Chưa có dữ liệu Commit
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Các thành viên trong nhóm chưa đẩy đoạn mã nào lên GitHub hoặc dữ liệu
          chưa được đồng bộ.
        </p>
      </div>
    );

  const activeMemberData =
    data.members_commits.find((m: any) => m.member._id === selectedMemberId) ||
    data.members_commits[0];

  const activeStudent = activeMemberData?.member?.student;
  const activeCommits = activeMemberData?.commits || [];

  return (
    // Đã thêm h-[700px] để khóa cứng chiều cao toàn bộ tab
    <div className="flex flex-col h-[700px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      {/* --- HEADER CHUNG (Cố định ở trên) --- */}
      <div className="shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 md:p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 dark:bg-slate-100 rounded-2xl shadow-md">
            <Github className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Lịch sử Commits
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 border-none px-2 py-0.5 text-xs font-bold"
              >
                {data.summary?.total_commits || 0} Commits
              </Badge>
              <span className="text-xs text-slate-500 font-medium">
                đã được hệ thống xử lý
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY CHIA 2 CỘT --- Thêm min-h-0 để overflow hoạt động */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 bg-slate-50/30 dark:bg-slate-900/10">
        {/* CỘT TRÁI: DANH SÁCH THÀNH VIÊN */}
        <div className="w-full lg:w-1/3 xl:w-[35%] flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
          <div className="shrink-0 p-4 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Danh sách đóng góp
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {data.members_commits.map((memberData: any) => {
              const student = memberData.member.student;
              const isSelected = selectedMemberId === memberData.member._id;
              const validCommitsCount = (memberData.commits || []).filter(
                (c: any) => c.is_counted
              ).length;

              return (
                <button
                  key={memberData.member._id}
                  onClick={() => setSelectedMemberId(memberData.member._id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left border",
                    isSelected
                      ? "bg-white dark:bg-slate-800 border-blue-500/50 dark:border-blue-500/50 shadow-sm ring-1 ring-blue-500/20"
                      : "bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar
                      className={cn(
                        "h-10 w-10 shrink-0 border-2 transition-colors",
                        isSelected
                          ? "border-blue-500"
                          : "border-white dark:border-slate-800 shadow-sm"
                      )}
                    >
                      <AvatarImage src={student?.avatar_url} />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300 text-xs">
                        {student?.full_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-bold truncate",
                          isSelected
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-slate-900 dark:text-slate-100"
                        )}
                      >
                        {student?.full_name || "Chưa gán sinh viên"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">
                          {student?.student_code || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span
                      className={cn(
                        "text-xs font-black",
                        isSelected
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {validCommitsCount}/{memberData.total}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      hợp lệ
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: TIMELINE COMMITS */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950">
          <div className="shrink-0 p-4 border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
                Đang xem:
              </span>
              <Badge
                variant="outline"
                className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-sm py-1"
              >
                {activeStudent?.full_name}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 hover:bg-emerald-50">
                {activeCommits.filter((c: any) => c.is_counted).length} Hợp lệ
              </Badge>
            </div>
          </div>

          {/* Vùng cuộn Timeline */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 relative">
            {activeCommits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <GitCommit className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">
                  Sinh viên này chưa có commit nào.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 space-y-6">
                {/* Trục thời gian (Vertical Line) */}
                <div className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full" />

                {activeCommits.map((commit: any) => (
                  <div key={commit._id} className="relative group">
                    <div
                      className={cn(
                        "absolute -left-[30px] sm:-left-[38px] top-5 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-950 z-10 transition-colors",
                        commit.is_counted
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                          : "bg-slate-300 dark:bg-slate-600"
                      )}
                    />

                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
                            {commit.message}
                          </p>

                          <div className="flex items-center flex-wrap gap-3 mt-3">
                            <Badge
                              variant="secondary"
                              className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-50 border-none font-mono text-[10px] px-2 py-0.5 gap-1.5"
                            >
                              <GitBranch className="w-3 h-3" />
                              {commit.branch || "main"}
                            </Badge>
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3" />
                              {format(
                                new Date(commit.commit_date),
                                "HH:mm, dd/MM/yyyy"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                          <a
                            href={commit.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group/link flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <GitCommit className="w-3.5 h-3.5" />
                            <span className="font-mono text-xs font-bold">
                              {commit.hash.substring(0, 7)}
                            </span>
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100" />
                          </a>

                          {commit.is_counted ? (
                            <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-50 text-[10px] gap-1 px-2 py-0.5 shadow-sm">
                              <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 border-none text-[10px] gap-1 px-2 py-0.5"
                            >
                              <XCircle className="w-3 h-3" /> Bỏ qua
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!commit.is_counted && commit.rejection_reason && (
                        <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-0.5">
                              Lý do loại
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-300 font-medium">
                              {commit.rejection_reason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
