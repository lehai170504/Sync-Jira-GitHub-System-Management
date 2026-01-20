"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRole } from "@/components/layouts/sidebar";
import { triggerJiraSync } from "@/server/actions/sync-actions";
import { toast } from "sonner";
import { RefreshCw, LayoutList, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function LeaderJiraSyncPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastRun, setLastRun] = useState<string | undefined>(undefined);
  const [jiraStats, setJiraStats] = useState<{
    totalIssues?: number;
    newIssues?: number;
    updatedIssues?: number;
  } | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);

    // Lấy timestamp lần sync trước từ localStorage (nếu có)
    if (typeof window !== "undefined") {
      const storedLastRun = window.localStorage.getItem("leader_jira_last_sync");
      if (storedLastRun) {
        setLastRun(storedLastRun);
      }
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    const startTime = Date.now();

    try {
      const res = await triggerJiraSync();

      // Giả lập thêm một chút delay cho mượt
      const elapsed = Date.now() - startTime;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }

      if (res.success && res.jira) {
        setLastRun(res.timestamp);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("leader_jira_last_sync", res.timestamp);
        }
        setJiraStats(res.jira);
        toast.success("Đã đồng bộ Jira thành công!", {
          description: `Đã cập nhật ${res.jira.newIssues} task mới và ${res.jira.updatedIssues} task được cập nhật.`,
        });
      } else {
        toast.error("Đồng bộ Jira thất bại", {
          description: res.error,
        });
      }
    } catch (error) {
      toast.error("Lỗi không xác định khi đồng bộ Jira");
    } finally {
      setIsSyncing(false);
    }
  };

  // Nếu không phải LEADER thì chỉ cho xem thông báo
  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Sync Jira</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để kích hoạt đồng bộ Jira cho nhóm của mình.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài khoản Leader nếu muốn đồng bộ Jira.
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
            <LayoutList className="h-7 w-7 text-[#F27124]" />
            Sync Jira
          </h2>
          <p className="text-muted-foreground">
            Lấy danh sách task mới nhất từ Jira cho dự án của nhóm bạn.
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-md"
        >
          <RefreshCw
            className={`mr-2 h-5 w-5 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Đang Sync Jira..." : "Bắt đầu Sync Jira"}
        </Button>
      </div>

      <Separator />

      {/* WARNING ALERT */}
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Lưu ý khi đồng bộ</AlertTitle>
        <AlertDescription>
          Quá trình sync có thể mất vài giây tùy theo số lượng task trong Jira. Vui lòng không đóng trình duyệt trong
          khi đang xử lý.
        </AlertDescription>
      </Alert>

      {/* RESULT SUMMARY */}
      {jiraStats && (
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
              <div className="text-muted-foreground text-xs">Tổng số task</div>
              <div className="text-xl font-bold">
                {jiraStats.totalIssues ?? "--"}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-emerald-700 text-xs font-medium">
                Task mới
              </div>
              <div className="text-xl font-bold text-emerald-700">
                {jiraStats.newIssues ?? 0}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="text-blue-700 text-xs font-medium">
                Task được cập nhật
              </div>
              <div className="text-xl font-bold text-blue-700">
                {jiraStats.updatedIssues ?? 0}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Dữ liệu task sau khi sync sẽ được sử dụng để tính điểm tự động và hiển thị trên Dashboard của nhóm.
          </p>
        </div>
      )}
    </div>
  );
}


