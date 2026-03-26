"use client";

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
// import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TeamGithubTab({ teamId }: { teamId: string }) {
  const { data, isLoading } = useTeamCommits(teamId);

  // 1. TRẠNG THÁI ĐANG TẢI
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
          Đang đồng bộ kho lưu trữ...
        </p>
      </div>
    );

  // 2. TRẠNG THÁI TRỐNG
  if (!data || !data.members_commits || data.members_commits.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 p-6 text-center">
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

  // 3. TRẠNG THÁI THÀNH CÔNG - GIAO DIỆN VIP PRO
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      {/* --- HEADER --- */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 md:p-6 flex items-center justify-between sticky top-0 z-10">
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
                đã được ghi nhận từ hệ thống
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH THÀNH VIÊN & TIMELINE --- */}
      <div className="flex-1 p-4 md:p-6 max-h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-700">
        <Accordion
          type="multiple"
          defaultValue={data.members_commits.map((m: any) => m.member._id)}
          className="space-y-6"
        >
          {data.members_commits.map((memberData: any) => {
            const student = memberData.member.student;
            const commits = memberData.commits || [];
            const validCommits = commits.filter(
              (c: any) => c.is_counted
            ).length;

            return (
              <AccordionItem
                key={memberData.member._id}
                value={memberData.member._id}
                className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-3xl px-2 shadow-sm transition-all"
              >
                <AccordionTrigger className="hover:no-underline p-4 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-1 items-center justify-between mr-4">
                    {/* Thông tin Sinh viên */}
                    <div className="flex items-center gap-4 text-left">
                      <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-md">
                        <AvatarImage src={student?.avatar_url} />
                        <AvatarFallback className="bg-slate-200 dark:bg-slate-700 font-black text-slate-600 dark:text-slate-300">
                          {student?.full_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {student?.full_name}
                          </p>
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] border-slate-300 dark:border-slate-600 px-1.5 bg-white dark:bg-slate-950"
                          >
                            {student?.student_code}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5" />
                          {memberData.member.github_username ? (
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              @{memberData.member.github_username}
                            </span>
                          ) : (
                            <span className="italic">Chưa map tài khoản</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Thống kê nhỏ bên phải */}
                    <div className="hidden sm:flex flex-col items-end gap-1 text-right">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Đóng góp
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none text-xs">
                          {validCommits} Hợp lệ
                        </Badge>
                        <span className="text-slate-300 dark:text-slate-600">
                          /
                        </span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                          {memberData.total} Tổng
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-2 pb-6 px-4">
                  {commits.length === 0 ? (
                    <div className="text-center py-8 bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <GitCommit className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-medium text-slate-500">
                        Thành viên này chưa đẩy code lên nhánh nào.
                      </p>
                    </div>
                  ) : (
                    <div className="relative pl-6 sm:pl-8 space-y-6 mt-4">
                      {/* Trục thời gian (Vertical Line) */}
                      <div className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full" />

                      {commits.map((commit: any) => (
                        <div key={commit._id} className="relative group">
                          {/* Dấu chấm Timeline */}
                          <div
                            className={cn(
                              "absolute -left-[30px] sm:-left-[38px] top-6 h-3.5 w-3.5 rounded-full ring-4 ring-slate-50 dark:ring-slate-900/20 z-10 transition-colors",
                              commit.is_counted
                                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                : "bg-slate-300 dark:bg-slate-600"
                            )}
                          />

                          {/* Thẻ Commit (Card) */}
                          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed line-clamp-2">
                                  {commit.message}
                                </p>

                                {/* Badge Nhánh & Thời gian */}
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

                              {/* Nút Link & Trạng thái */}
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

                            {/* Cảnh báo nếu Commit bị loại (Rejected) */}
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
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
