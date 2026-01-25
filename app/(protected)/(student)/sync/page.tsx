"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRole } from "@/components/layouts/sidebar-config";
import { toast } from "sonner";
import {
  RefreshCw,
  GitCommit,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LayoutList,
  TrendingUp,
  Zap,
  ExternalLink,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyProject } from "@/features/projects/hooks/use-my-project";
import { syncProjectApi } from "@/features/integration/api/sync-api";
import { SyncResponse } from "@/features/integration/types";

export default function SyncPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Lấy project hiện tại để lấy projectId
  const { data: project, isLoading: isLoadingProject } = useMyProject();

  const [lastSyncTime, setLastSyncTime] = useState<string | undefined>(
    undefined,
  );

  const [syncResult, setSyncResult] = useState<SyncResponse | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeaderState(leaderStatus);

    // Lấy thời gian sync gần nhất từ localStorage
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("last_sync_time");
      if (stored) setLastSyncTime(stored);
    }
  }, []);

  const isLeader = isLeaderState;

  const handleSyncAll = async () => {
    if (!project?._id) {
      toast.error("Chưa có dự án", {
        description: "Vui lòng tạo hoặc chọn dự án trước khi đồng bộ.",
      });
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      console.log("[Sync] Gửi xuống BE: POST /integrations/projects/:projectId/sync", {
        projectId: project._id,
        jiraProjectKey: project.jiraProjectKey,
        githubRepoUrl: project.githubRepoUrl,
        note: "Chỉ gửi projectId (path). BE tự lấy jiraProjectKey, githubRepoUrl từ project.",
      });
      const result = await syncProjectApi(project._id);
      const gh = result?.stats?.github ?? 0;
      const jr = result?.stats?.jira ?? 0;
      const errors = result?.stats?.errors ?? [];

      setSyncResult({
        ...result,
        stats: { github: gh, jira: jr, errors },
      });
      const now = new Date().toISOString();
      setLastSyncTime(now);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("last_sync_time", now);
      }

      const has410 = errors.some(
        (e) => e.includes("410") || e.includes("không còn tồn tại"),
      );

      if (gh > 0) {
        toast.success(result.message ?? "Đồng bộ hoàn tất", {
          description: `GitHub: ${gh} commits. Jira: ${jr} issues.`,
        });
      } else {
        toast.success(result.message ?? "Đồng bộ hoàn tất", {
          description: `Jira: ${jr} issues.`,
        });
      }
      if (has410) {
        toast.warning("Jira project không còn tồn tại", {
          description:
            gh > 0
              ? "GitHub đã đồng bộ bình thường."
              : "Kiểm tra lại Jira Project Key của dự án.",
        });
      } else if (errors.length > 0 && !has410) {
        toast.error("Lỗi đồng bộ", {
          description: errors[0] ?? "Xem chi tiết trong kết quả.",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Không thể đồng bộ dữ liệu. Vui lòng thử lại sau.";
      toast.error("Đồng bộ thất bại", {
        description: errorMessage,
      });
      setSyncResult(null);
    } finally {
      setIsSyncing(false);
    }
  };

  // Chỉ LEADER và MEMBER mới được truy cập
  if (role !== "STUDENT") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0">
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài
            khoản Leader hoặc Member.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg">
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Đồng bộ dữ liệu trung tâm
            </h2>
            <p className="text-muted-foreground mt-1">
              Kích hoạt đồng bộ đồng thời Jira và GitHub để cập nhật dashboard,
              điểm số và báo cáo.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {project?.jira_sync_warning && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Cảnh báo Jira</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            {project.jira_sync_warning}
          </AlertDescription>
        </Alert>
      )}

      {/* ACTION AREA */}
      <Card className="border-2 border-violet-100 shadow-xl bg-gradient-to-br from-white to-violet-50/50 overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-2 max-w-lg">
            <h3 className="text-xl font-bold text-gray-900">
              Sẵn sàng đồng bộ
            </h3>
            <p className="text-gray-500">
              Nhấn nút bên dưới để lấy dữ liệu task mới nhất từ Jira và commit
              từ GitHub về hệ thống. Quá trình này sẽ mất vài giây.
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleSyncAll}
            disabled={isSyncing || isLoadingProject || !project?._id}
            className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                Đang xử lý dữ liệu...
              </>
            ) : isLoadingProject ? (
              <>
                <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                Đang tải thông tin dự án...
              </>
            ) : !project?._id ? (
              <>
                <AlertTriangle className="mr-3 h-6 w-6" />
                Chưa có dự án
              </>
            ) : (
              <>
                <Zap className="mr-3 h-6 w-6 fill-yellow-300 text-yellow-100" />
                Bắt đầu Đồng bộ Tất cả
              </>
            )}
          </Button>

          {project?._id && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span title="Jira Project Key">
                Jira: <strong className="text-gray-700">{project.jiraProjectKey || "—"}</strong>
              </span>
              <span>•</span>
              <span title="GitHub Repo">
                GitHub: <strong className="text-gray-700 truncate max-w-[180px]">{project.githubRepoUrl ? project.githubRepoUrl.replace(/^https?:\/\//, "") : "—"}</strong>
              </span>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1 text-violet-600 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Kiểm tra kết nối Jira/GitHub
              </Link>
            </div>
          )}

          {lastSyncTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 px-4 py-2 rounded-full border shadow-sm">
              <Clock className="h-4 w-4 text-violet-600" />
              <span>
                Lần chạy gần nhất:{" "}
                <span className="font-semibold text-gray-700">
                  {new Date(lastSyncTime).toLocaleString("vi-VN")}
                </span>
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* RESULTS GRID */}
      {syncResult && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* JIRA CARD */}
          <Card className="border shadow-md flex flex-col h-full">
            <CardHeader className="bg-indigo-50/50 border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <LayoutList className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    Trạng thái Jira
                  </CardTitle>
                </div>
                {syncResult.stats.jira > 0 ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Đã cập nhật
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Chưa có dữ liệu
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-sm text-indigo-600 font-medium mb-1">
                    Issues đã đồng bộ
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-indigo-700">
                      {syncResult.stats.jira}
                    </span>
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                  </div>
                </div>
                {syncResult.stats.jira === 0 && (() => {
                  const errs = syncResult.stats.errors ?? [];
                  const has410 = errs.some(
                    (e) => e.includes("410") || e.includes("không còn tồn tại"),
                  );
                  return has410 ? (
                    <Alert className="bg-amber-50 border-amber-200">
                      <Info className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800">Jira project không còn tồn tại</AlertTitle>
                      <AlertDescription className="text-amber-700 text-sm">
                        {errs.find((e) => e.includes("410") || e.includes("không còn tồn tại")) ??
                          "Jira project không còn tồn tại (410). GitHub đã đồng bộ bình thường."}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-amber-50 border-amber-200">
                      <Info className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800">Jira không đồng bộ được</AlertTitle>
                      <AlertDescription className="text-amber-700 text-sm">
                        Jira trả 0 issue. Kiểm tra: (1){" "}
                        <Link href="/profile" className="underline font-medium">Hồ sơ → Tích hợp</Link> đã kết nối Jira;
                        (2) Project Key <strong>{project?.jiraProjectKey ?? "—"}</strong> khớp với project Jira;
                        (3) Token/quyền Jira còn hiệu lực.
                      </AlertDescription>
                    </Alert>
                  );
                })()}
                {(syncResult.stats.errors ?? []).length > 0 &&
                  !(syncResult.stats.errors ?? []).some(
                    (e) => e.includes("410") || e.includes("không còn tồn tại"),
                  ) && (
                  <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                    {(syncResult.stats.errors ?? [])[0]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* GITHUB CARD */}
          <Card className="border shadow-md flex flex-col h-full">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <GitCommit className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    Trạng thái GitHub
                  </CardTitle>
                </div>
                {syncResult.stats.github > 0 ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Đã cập nhật
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Chưa có dữ liệu
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-600 font-medium mb-1">
                    Commits đã đồng bộ
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-700">
                      {syncResult.stats.github}
                    </span>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!syncResult && !isSyncing && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border shadow-md flex flex-col h-full">
            <CardHeader className="bg-indigo-50/50 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <LayoutList className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Trạng thái Jira
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8 opacity-50">
                <LayoutList className="h-12 w-12 text-gray-300" />
                <p>Chưa có dữ liệu phiên làm việc này</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-md flex flex-col h-full">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                  <GitCommit className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Trạng thái GitHub
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8 opacity-50">
                <GitCommit className="h-12 w-12 text-gray-300" />
                <p>Chưa có dữ liệu phiên làm việc này</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
