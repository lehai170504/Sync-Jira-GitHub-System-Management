"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRole } from "@/components/layouts/sidebar";
import { triggerGithubSync } from "@/server/actions/sync-actions";
import { toast } from "sonner";
import { RefreshCw, GitCommit, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function LeaderGithubSyncPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastRun, setLastRun] = useState<string | undefined>(undefined);
  const [githubStats, setGithubStats] = useState<{
    totalCommits?: number;
    newCommits?: number;
    linesOfCode?: number;
  } | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);

    // Lấy timestamp lần sync GitHub trước từ localStorage (nếu có)
    if (typeof window !== "undefined") {
      const storedLastRun = window.localStorage.getItem("leader_github_last_sync");
      if (storedLastRun) {
        setLastRun(storedLastRun);
      }
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    const startTime = Date.now();

    try {
      const res = await triggerGithubSync();

      const elapsed = Date.now() - startTime;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }

      if (res.success && res.github) {
        setLastRun(res.timestamp);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("leader_github_last_sync", res.timestamp);
        }
        setGithubStats(res.github);
        toast.success("Đã đồng bộ GitHub thành công!", {
          description: `Đã phát hiện ${res.github.newCommits} commit mới với tổng ${res.github.linesOfCode} dòng code.`,
        });
      } else {
        toast.error("Đồng bộ GitHub thất bại", {
          description: res.error,
        });
      }
    } catch (error) {
      toast.error("Lỗi không xác định khi đồng bộ GitHub");
    } finally {
      setIsSyncing(false);
    }
  };

  // Chỉ LEADER mới được sync, role khác xem thông báo
  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Sync GitHub</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để kích hoạt đồng bộ GitHub cho repository của nhóm.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài khoản Leader nếu muốn đồng bộ GitHub.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GitCommit className="h-7 w-7 text-[#111827]" />
            Sync GitHub
          </h2>
          <p className="text-muted-foreground">
            Lấy danh sách commit mới nhất từ repository GitHub của nhóm bạn.
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-slate-900 hover:bg-slate-800 shadow-md"
        >
          <RefreshCw
            className={`mr-2 h-5 w-5 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Đang Sync GitHub..." : "Bắt đầu Sync GitHub"}
        </Button>
      </div>

      <Separator />

      {/* WARNING ALERT */}
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Lưu ý khi đồng bộ</AlertTitle>
        <AlertDescription>
          Quá trình sync có thể mất vài giây tùy theo số lượng commit. Vui lòng không đóng trình duyệt trong khi đang xử
          lý.
        </AlertDescription>
      </Alert>

      {/* RESULT SUMMARY */}
      {githubStats && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-base">Kết quả lần sync gần nhất</h3>
            </div>
            {lastRun && (
              <span className="text-xs text-muted-foreground">
                Thời gian: {new Date(lastRun).toLocaleString("vi-VN")}
              </span>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="p-3 rounded-lg bg-slate-50 border">
              <div className="text-muted-foreground text-xs">Tổng số commits</div>
              <div className="text-xl font-bold">
                {githubStats.totalCommits ?? "--"}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-emerald-700 text-xs font-medium">
                Commits mới
              </div>
              <div className="text-xl font-bold text-emerald-700">
                {githubStats.newCommits ?? 0}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="text-blue-700 text-xs font-medium">
                Lines of Code
              </div>
              <div className="text-xl font-bold text-blue-700">
                {githubStats.linesOfCode ?? 0}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Dữ liệu commit sau khi sync sẽ được sử dụng để tính điểm GitHub và hiển thị trên Dashboard.
          </p>
        </div>
      )}
    </div>
  );
}


