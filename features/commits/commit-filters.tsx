"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, GraduationCap, RefreshCw, Loader2, GitBranch } from "lucide-react";
import { toast } from "sonner";
import { syncTeamApi, type TeamSyncResponse } from "@/features/integration/api/team-sync-api";

interface ClassOption {
  id: string;
  name: string;
  code: string;
}

interface CommitFiltersProps {
  authorFilter: string;
  fromDate: string;
  toDate: string;
  authors: string[];
  onAuthorChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
  isLeader?: boolean;
  currentUserAuthorName?: string;
  leaderNames?: string[];
  classOptions?: ClassOption[];
  selectedClassId?: string;
  onClassChange?: (classId: string) => void;
  teamId?: string;
  /** Lọc theo nhánh Git */
  branchFilter?: string;
  onBranchChange?: (value: string) => void;
  branchOptions?: string[];
}

export function CommitFilters({
  authorFilter,
  fromDate,
  toDate,
  authors,
  onAuthorChange,
  onFromDateChange,
  onToDateChange,
  onReset,
  isLeader = true,
  currentUserAuthorName = "",
  leaderNames = [],
  classOptions = [],
  selectedClassId = "",
  onClassChange,
  teamId,
  branchFilter = "",
  onBranchChange,
  branchOptions = [],
}: CommitFiltersProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<TeamSyncResponse | null>(null);

  const hasActiveFilters =
    fromDate ||
    toDate ||
    branchFilter ||
    (selectedClassId && classOptions.length > 1);

  const handleSync = async () => {
    if (!teamId) {
      toast.error("Chưa có team", {
        description: "Vui lòng chọn lớp học trước khi đồng bộ.",
      });
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      const result = await syncTeamApi(teamId);
      setSyncResult(result);

      const { git, jira_sprints, jira_tasks, errors } = result.stats;

      if (errors.length > 0) {
        toast.warning(result.message || "Đồng bộ hoàn tất với một số lỗi", {
          description: `Git: ${git} commits. Jira: ${jira_tasks} tasks, ${jira_sprints} sprints.`,
        });
      } else {
        toast.success(result.message || "Đồng bộ hoàn tất", {
          description: `Git: ${git} commits. Jira: ${jira_tasks} tasks, ${jira_sprints} sprints.`,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Không thể đồng bộ dữ liệu.";
      toast.error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-linear-to-br from-white to-purple-50/20 dark:from-slate-900 dark:to-slate-900/80">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <Filter className="h-4 w-4 text-purple-600" />
          </div>
          <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Lọc commit
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Class Filter và Date Filters - Cùng hàng với justify-between */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Class Filter - Bên trái */}
          {classOptions.length > 1 && onClassChange && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-600" />
                Lớp học
              </label>
              <Select value={selectedClassId} onValueChange={onClassChange}>
                <SelectTrigger className="w-full md:w-[280px] border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      <div className="flex items-center gap-2">
                        <span>{cls.name}</span>
                        {cls.code && (
                          <span className="text-xs text-muted-foreground">({cls.code})</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Branch filter */}
          {branchOptions.length > 0 && onBranchChange && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-600" />
                Nhánh
              </label>
              <Select value={branchFilter || "ALL"} onValueChange={(v) => onBranchChange(v === "ALL" ? "" : v)}>
                <SelectTrigger className="w-full md:w-[200px] border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <SelectValue placeholder="Tất cả nhánh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    Tất cả nhánh
                  </SelectItem>
                  {branchOptions.map((b) => (
                    <SelectItem key={b} value={b} className="text-xs">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date filters, Nút Xóa lọc - Bên phải */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Từ ngày</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => onFromDateChange(e.target.value)}
                  className="w-full md:w-[200px] border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Đến ngày</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => onToDateChange(e.target.value)}
                  className="w-full md:w-[200px] border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Button
                variant="outline"
                onClick={onReset}
                disabled={!hasActiveFilters}
                className="border-2 border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4 mr-2" />
                Xóa lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Kết quả đồng bộ - Phía dưới */}
        {syncResult && (
          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-md border border-purple-200 dark:border-purple-900/60">
            <p className="font-medium text-purple-700 dark:text-purple-200">
              {syncResult.message}
            </p>
            <div className="flex gap-4 text-xs">
              <span>Git: {syncResult.stats.git} commits</span>
              <span>Jira: {syncResult.stats.jira_tasks} tasks</span>
              <span>Sprints: {syncResult.stats.jira_sprints}</span>
            </div>
            {syncResult.stats.errors.length > 0 && (
              <div className="text-red-600 text-xs">
                <p className="font-medium">Lỗi:</p>
                <ul className="list-disc list-inside">
                  {syncResult.stats.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Bỏ filter thành viên theo yêu cầu */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/40 px-3 py-2 rounded-md">
            <Filter className="h-3 w-3" />
            <span>Đang áp dụng bộ lọc</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

