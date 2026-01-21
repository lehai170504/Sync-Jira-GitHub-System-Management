"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { UserRole } from "@/components/layouts/sidebar";
import { triggerJiraSync, triggerGithubSync } from "@/server/actions/sync-actions";
import { toast } from "sonner";
import {
  RefreshCw,
  LayoutList,
  GitCommit,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function SyncPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");

  const [isSyncingJira, setIsSyncingJira] = useState(false);
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);

  const [lastJiraRun, setLastJiraRun] = useState<string | undefined>(undefined);
  const [lastGithubRun, setLastGithubRun] = useState<string | undefined>(undefined);

  const [jiraStats, setJiraStats] = useState<{
    totalIssues?: number;
    newIssues?: number;
    updatedIssues?: number;
  } | null>(null);

  const [githubStats, setGithubStats] = useState<{
    totalCommits?: number;
    newCommits?: number;
    linesOfCode?: number;
  } | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) {
      setRole(savedRole);
      const isLeaderRole = savedRole === "LEADER";
      const prefix = isLeaderRole ? "leader" : "member";
      
      if (typeof window !== "undefined") {
        const storedJira = window.localStorage.getItem(`${prefix}_jira_last_sync`);
        const storedGithub = window.localStorage.getItem(`${prefix}_github_last_sync`);
        if (storedJira) setLastJiraRun(storedJira);
        if (storedGithub) setLastGithubRun(storedGithub);
      }
    }
  }, []);

  const handleJiraSync = async () => {
    setIsSyncingJira(true);
    const startTime = Date.now();

    try {
      const res = await triggerJiraSync();

      const elapsed = Date.now() - startTime;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }

      if (res.success && res.jira) {
        setLastJiraRun(res.timestamp);
        if (typeof window !== "undefined") {
          const prefix = isLeader ? "leader" : "member";
          window.localStorage.setItem(`${prefix}_jira_last_sync`, res.timestamp);
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
      setIsSyncingJira(false);
    }
  };

  const handleGithubSync = async () => {
    setIsSyncingGithub(true);
    const startTime = Date.now();

    try {
      const res = await triggerGithubSync();

      const elapsed = Date.now() - startTime;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }

      if (res.success && res.github) {
        setLastGithubRun(res.timestamp);
        if (typeof window !== "undefined") {
          const prefix = isLeader ? "leader" : "member";
          window.localStorage.setItem(`${prefix}_github_last_sync`, res.timestamp);
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
      setIsSyncingGithub(false);
    }
  };

  // Chỉ LEADER và MEMBER mới được truy cập
  if (role !== "LEADER" && role !== "MEMBER") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Đồng bộ dữ liệu</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader và Member để kích hoạt đồng bộ Jira & GitHub.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài khoản Leader hoặc Member nếu muốn đồng bộ dữ liệu.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLeader = role === "LEADER";

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <RefreshCw className="h-7 w-7 text-[#F27124]" />
          Đồng bộ dữ liệu
        </h2>
        <p className="text-muted-foreground">
          Kích hoạt đồng bộ Jira và GitHub cho nhóm. Dữ liệu sau khi sync sẽ được dùng cho dashboard, điểm tự động và báo cáo.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="jira" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jira">Jira</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>

        {/* JIRA TAB */}
        <TabsContent value="jira" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <LayoutList className="h-6 w-6 text-indigo-600" />
                Sync Jira
              </h3>
              <p className="text-muted-foreground">
                Lấy danh sách task mới nhất từ Jira cho dự án của nhóm bạn.
              </p>
              {lastJiraRun && (
                <span className="text-xs text-muted-foreground">
                  Lần sync gần nhất: {new Date(lastJiraRun).toLocaleString("vi-VN")}
                </span>
              )}
            </div>
            <Button
              size="lg"
              onClick={handleJiraSync}
              disabled={isSyncingJira}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-md"
            >
              <RefreshCw
                className={`mr-2 h-5 w-5 ${isSyncingJira ? "animate-spin" : ""}`}
              />
              {isSyncingJira ? "Đang Sync Jira..." : "Bắt đầu Sync Jira"}
            </Button>
          </div>

          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Lưu ý khi đồng bộ</AlertTitle>
            <AlertDescription>
              Quá trình sync có thể mất vài giây tùy theo số lượng task trong Jira. Vui lòng không đóng trình duyệt trong khi đang xử lý.
            </AlertDescription>
          </Alert>

          {jiraStats && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-base">Kết quả lần sync gần nhất</h4>
                </div>
                {lastJiraRun && (
                  <span className="text-xs text-muted-foreground">
                    Thời gian: {new Date(lastJiraRun).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <div className="text-muted-foreground text-xs">Tổng số task</div>
                  <div className="text-xl font-bold">{jiraStats.totalIssues ?? "--"}</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="text-emerald-700 text-xs font-medium">Task mới</div>
                  <div className="text-xl font-bold text-emerald-700">
                    {jiraStats.newIssues ?? 0}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-blue-700 text-xs font-medium">Task được cập nhật</div>
                  <div className="text-xl font-bold text-blue-700">
                    {jiraStats.updatedIssues ?? 0}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Dữ liệu task sau khi sync sẽ được dùng để tính điểm tự động và hiển thị trên Dashboard của nhóm.
              </p>
            </div>
          )}
        </TabsContent>

        {/* GITHUB TAB */}
        <TabsContent value="github" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <GitCommit className="h-6 w-6 text-slate-900" />
                Sync GitHub
              </h3>
              <p className="text-muted-foreground">
                Lấy danh sách commit mới nhất từ repository GitHub của nhóm bạn.
              </p>
              {lastGithubRun && (
                <span className="text-xs text-muted-foreground">
                  Lần sync gần nhất: {new Date(lastGithubRun).toLocaleString("vi-VN")}
                </span>
              )}
            </div>
            <Button
              size="lg"
              onClick={handleGithubSync}
              disabled={isSyncingGithub}
              className="bg-slate-900 hover:bg-slate-800 shadow-md"
            >
              <RefreshCw
                className={`mr-2 h-5 w-5 ${isSyncingGithub ? "animate-spin" : ""}`}
              />
              {isSyncingGithub ? "Đang Sync GitHub..." : "Bắt đầu Sync GitHub"}
            </Button>
          </div>

          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Lưu ý khi đồng bộ</AlertTitle>
            <AlertDescription>
              Quá trình sync có thể mất vài giây tùy theo số lượng commit. Vui lòng không đóng trình duyệt trong khi đang xử lý.
            </AlertDescription>
          </Alert>

          {githubStats && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-base">Kết quả lần sync gần nhất</h4>
                </div>
                {lastGithubRun && (
                  <span className="text-xs text-muted-foreground">
                    Thời gian: {new Date(lastGithubRun).toLocaleString("vi-VN")}
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
                  <div className="text-emerald-700 text-xs font-medium">Commits mới</div>
                  <div className="text-xl font-bold text-emerald-700">
                    {githubStats.newCommits ?? 0}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-blue-700 text-xs font-medium">Lines of Code</div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}


