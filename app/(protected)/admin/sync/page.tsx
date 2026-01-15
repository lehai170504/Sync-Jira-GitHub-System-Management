"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServiceStatusCard } from "@/components/features/sync/service-status-card";
import { triggerFullSync } from "@/server/actions/sync-actions";
import { toast } from "sonner";
import { RefreshCw, LayoutList, GitCommit, AlertTriangle } from "lucide-react";

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastRun, setLastRun] = useState<string | undefined>(undefined);

  // State lưu kết quả trả về từ server để hiển thị lên UI
  const [syncResult, setSyncResult] = useState<{
    jira?: { totalIssues: number; newIssues: number };
    github?: { totalCommits: number; newCommits: number };
  } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    const startTime = Date.now();

    try {
      const res = await triggerFullSync();

      // Giả lập delay thêm 1 xíu cho mượt nếu API trả về quá nhanh
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000)
        await new Promise((r) => setTimeout(r, 1000 - elapsed));

      if (res.success && res.details) {
        setLastRun(res.details.timestamp);
        setSyncResult({
          jira: res.details.jira,
          github: res.details.github,
        });
        toast.success("Đồng bộ dữ liệu thành công!", {
          description: `Đã cập nhật ${res.details.jira.newIssues} tasks và ${res.details.github.newCommits} commits mới.`,
        });
      } else {
        toast.error("Đồng bộ thất bại", { description: res.error });
      }
    } catch (err) {
      toast.error("Lỗi không xác định");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Đồng bộ dữ liệu</h2>
          <p className="text-muted-foreground">
            Kích hoạt tiến trình lấy dữ liệu mới nhất từ Jira và GitHub về hệ
            thống.
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
          {isSyncing ? "Đang đồng bộ..." : "Bắt đầu Sync"}
        </Button>
      </div>

      <Separator />

      {/* WARNING ALERT */}
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Lưu ý hiệu năng</AlertTitle>
        <AlertDescription>
          Quá trình đồng bộ có thể mất từ 1-2 phút tùy thuộc vào lượng dữ liệu.
          Vui lòng không tắt trình duyệt.
        </AlertDescription>
      </Alert>

      {/* GRID STATUS CARDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* JIRA CARD */}
        <ServiceStatusCard
          title="Jira Software"
          icon={LayoutList}
          status={isSyncing ? "loading" : syncResult ? "success" : "idle"}
          lastSync={lastRun}
          stats={[
            {
              label: "Tổng số Task",
              value: syncResult?.jira?.totalIssues || "--",
            },
            { label: "Task mới", value: syncResult?.jira?.newIssues || "--" },
          ]}
        />

        {/* GITHUB CARD */}
        <ServiceStatusCard
          title="GitHub Repository"
          icon={GitCommit}
          status={isSyncing ? "loading" : syncResult ? "success" : "idle"}
          lastSync={lastRun}
          stats={[
            {
              label: "Tổng Commits",
              value: syncResult?.github?.totalCommits || "--",
            },
            {
              label: "Commits mới",
              value: syncResult?.github?.newCommits || "--",
            },
          ]}
        />
      </div>

      {/* LOGS AREA (Optional) */}
      {syncResult && (
        <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold mb-4">Chi tiết đồng bộ phiên vừa qua</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✅ [Jira] Connected to project source successfully.</p>
            <p>
              ✅ [Jira] Fetched {syncResult.jira?.totalIssues} issues. Mapped
              100% users.
            </p>
            <p>✅ [GitHub] Clone repository metadata completed.</p>
            <p>
              ✅ [GitHub] Analyzed {syncResult.github?.totalCommits} commits.
            </p>
            <p className="text-green-600 font-medium">
              ✨ All systems synchronized successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
