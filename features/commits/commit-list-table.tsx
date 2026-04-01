"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { CheckCircle2, XCircle, GitCommit, Eye, ExternalLink } from "lucide-react";
import type { CommitItem } from "./types";
import { getValidation } from "./utils";

interface CommitListTableProps {
  commits: CommitItem[];
  onCommitClick: (commitId: string) => void;
  /** Thông báo khi danh sách trống (ví dụ: nhánh chưa đồng bộ) */
  emptyMessage?: string;
  /** URL repo GitHub để gọi API chi tiết patch (optional) */
  repoUrl?: string;
  /** Callback khi bấm nút "Xem chi tiết" - mở modal patch */
  onViewPatch?: (commit: CommitItem) => void;
}

export function CommitListTable({ commits, onCommitClick, emptyMessage, repoUrl, onViewPatch }: CommitListTableProps) {
  const formatDate_ddMMyyyy = (dateStr?: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    // en-GB -> dd/mm/yyyy, replace to dd-mm-yyyy
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
      .format(d)
      .replaceAll("/", "-");
  };

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none overflow-hidden bg-white dark:bg-slate-900">
      <CardHeader className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <GitCommit className="h-4 w-4 text-purple-600" />
          </div>
          <span className="bg-linear-to-r from-purple-600 to-indigo-400 bg-clip-text text-transparent">
            Danh sách commit
          </span>
          <Badge
            variant="secondary"
            className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200"
          >
            {commits.length} commit
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <TooltipProvider delayDuration={0}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[140px] font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Mã commit</TableHead>
                  <TableHead className="font-semibold">Nội dung</TableHead>
                  <TableHead className="font-semibold">Tác giả</TableHead>
                  <TableHead className="font-semibold">Branch</TableHead>
                  <TableHead className="font-semibold">Ngày</TableHead>
                  <TableHead className="text-right font-semibold">Lý do penalty</TableHead>
                  <TableHead className="w-[60px] text-center font-semibold">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <GitCommit className="h-8 w-8 opacity-50" />
                        <p className="text-sm font-medium">
                          {emptyMessage ||
                            "Không có commit trong khoảng thời gian này"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {commits.map((c) => {
                  const v = getValidation(c);
                  const rejectionReason =
                    c.rejection_reason ??
                    (c.is_counted === false
                      ? "Commit bị trừ điểm theo chính sách chất lượng."
                      : null);
                  return (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors group"
                      onClick={() => onCommitClick(c.id)}
                    >
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center gap-2">
                              {v.status === "valid" ? (
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-lg">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                                </div>
                              ) : (
                                <div className="p-1.5 bg-red-100 dark:bg-red-950/40 rounded-lg">
                                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
                                </div>
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  v.status === "valid"
                                    ? "text-emerald-700 dark:text-emerald-200"
                                    : "text-red-700 dark:text-red-200"
                                }`}
                              >
                                {v.label}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="text-xs">
                              <div className="font-semibold">{v.label}</div>
                              {v.reason ? <div className="mt-1">{v.reason}</div> : null}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-purple-700 dark:text-purple-300">
                            {c.id.substring(0, 7)}
                          </code>
                          {c.url && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={c.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 transition-colors"
                                  aria-label="Mở commit trên GitHub"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span className="text-xs">Mở trên GitHub</span>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-md">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate">{c.message}</span>
                          {(c.jira_issues && c.jira_issues.length > 0) && (
                            <span className="flex flex-wrap gap-1 shrink-0">
                              {c.jira_issues.map((key) => (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className="text-[10px] font-mono font-semibold bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800"
                                >
                                  {key}
                                </Badge>
                              ))}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-linear-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                            {c.author.charAt(0)}
                          </div>
                          <span className="text-sm">{c.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {(c.branches && c.branches.length > 0
                            ? c.branches
                            : [c.branch]
                          ).map((b, idx) => {
                            const colors = [
                              "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
                              "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
                              "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
                              "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
                              "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
                            ];
                            const colorClass =
                              colors[idx % colors.length];
                            return (
                              <Badge
                                key={`${b}-${idx}`}
                                variant="outline"
                                className={`text-[10px] font-mono font-semibold border ${colorClass}`}
                              >
                                {b}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate_ddMMyyyy(c.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {rejectionReason ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="text-[11px] border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-950/40 max-w-[260px] truncate inline-block align-middle"
                          >
                                {rejectionReason}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <div className="text-xs">
                                <div className="font-semibold">Lý do penalty</div>
                                <div className="mt-1">{rejectionReason}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[11px] border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40"
                          >
                            —
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {onViewPatch ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewPatch(c);
                                }}
                                className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span className="text-xs">Xem chi tiết</span>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

