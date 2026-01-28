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
import { Filter, X, Crown, GraduationCap, RefreshCw, Loader2 } from "lucide-react";
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
  leaderNames?: string[]; // Danh sách tên các leader để đánh dấu
  classOptions?: ClassOption[]; // Danh sách classes từ API
  selectedClassId?: string; // Class ID đang được chọn
  onClassChange?: (classId: string) => void; // Callback khi chọn class
  teamId?: string; // Team ID để gọi API sync
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
}: CommitFiltersProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<TeamSyncResponse | null>(null);

  const hasActiveFilters = 
    (isLeader && authorFilter !== "ALL") || 
    fromDate || 
    toDate || 
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
    <Card className="border-2 shadow-lg bg-gradient-to-br from-white to-purple-50/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Filter className="h-4 w-4 text-purple-600" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
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
                <SelectTrigger className="w-full md:w-[280px] border-2">
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

          {/* Date filters, Nút Xóa lọc và Nút Đồng bộ - Bên phải */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Từ ngày</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => onFromDateChange(e.target.value)}
                  className="w-full md:w-[200px] border-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Đến ngày</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => onToDateChange(e.target.value)}
                  className="w-full md:w-[200px] border-2"
                />
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Button
                variant="outline"
                onClick={onReset}
                disabled={!hasActiveFilters}
                className="border-2 hover:bg-purple-50"
              >
                <X className="h-4 w-4 mr-2" />
                Xóa lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Kết quả đồng bộ - Phía dưới */}
        {syncResult && (
          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-purple-50 rounded-md border border-purple-200">
            <p className="font-medium text-purple-700">{syncResult.message}</p>
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

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Author filter - chỉ hiển thị cho LEADER */}
          {isLeader ? (
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-foreground">Thành viên</label>
              <Select value={authorFilter} onValueChange={onAuthorChange}>
                <SelectTrigger className="w-full md:w-[240px] border-2">
                  <SelectValue placeholder="Chọn thành viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả thành viên</SelectItem>
                  {authors.map((a) => {
                    const isAuthorLeader = leaderNames.includes(a);
                    return (
                      <SelectItem key={a} value={a}>
                        <div className="flex items-center gap-2">
                          <span>{a}</span>
                          {isAuthorLeader && (
                            <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-foreground">Thành viên</label>
              <div className="px-3 py-2 bg-muted rounded-md border-2 border-purple-200 text-sm text-muted-foreground">
                {currentUserAuthorName || "Bạn"}
              </div>
            </div>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-md">
            <Filter className="h-3 w-3" />
            <span>Đang áp dụng bộ lọc</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

