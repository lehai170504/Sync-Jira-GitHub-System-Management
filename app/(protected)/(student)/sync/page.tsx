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
  FileText,
  Code,
  Zap,
} from "lucide-react";
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
      const result = await syncProjectApi(project._id);
      
      setSyncResult(result);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem("last_sync_time", now);
      }

      // Hiển thị thông báo thành công
      toast.success(result.message, {
        description: `Đã đồng bộ ${result.stats.github} commits từ GitHub và ${result.stats.jira} issues từ Jira.`,
      });
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
              <div className="space-y-6">
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
