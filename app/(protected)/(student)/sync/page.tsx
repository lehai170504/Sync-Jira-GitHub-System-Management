"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRole } from "@/components/layouts/sidebar";
import {
  triggerJiraSync,
  triggerGithubSync,
} from "@/server/actions/sync-actions";
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
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SyncPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [isSyncing, setIsSyncing] = useState(false);

  const [lastJiraRun, setLastJiraRun] = useState<string | undefined>(undefined);
  const [lastGithubRun, setLastGithubRun] = useState<string | undefined>(
    undefined,
  );

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

  const isLeader = role === "LEADER";

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) {
      setRole(savedRole);
      const isLeaderRole = savedRole === "LEADER";
      const prefix = isLeaderRole ? "leader" : "member";

      if (typeof window !== "undefined") {
        const storedJira = window.localStorage.getItem(
          `${prefix}_jira_last_sync`,
        );
        const storedGithub = window.localStorage.getItem(
          `${prefix}_github_last_sync`,
        );
        if (storedJira) setLastJiraRun(storedJira);
        if (storedGithub) setLastGithubRun(storedGithub);
      }
    }
  }, []);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    const startTime = Date.now();
    const prefix = isLeader ? "leader" : "member";

    try {
      // Chạy song song cả 2 để tiết kiệm thời gian
      const [jiraRes, githubRes] = await Promise.all([
        triggerJiraSync(),
        triggerGithubSync(),
      ]);

      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await new Promise((r) => setTimeout(r, 1000 - elapsed));
      }

      // Xử lý kết quả Jira
      if (jiraRes.success && jiraRes.jira) {
        setLastJiraRun(jiraRes.timestamp);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            `${prefix}_jira_last_sync`,
            jiraRes.timestamp,
          );
        }
        setJiraStats(jiraRes.jira);
      }

      // Xử lý kết quả GitHub
      if (githubRes.success && githubRes.github) {
        setLastGithubRun(githubRes.timestamp);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            `${prefix}_github_last_sync`,
            githubRes.timestamp,
          );
        }
        setGithubStats(githubRes.github);
      }

      // Thông báo kết quả chung
      if (jiraRes.success && githubRes.success) {
        toast.success("Đồng bộ hoàn tất!", {
          description: `Đã cập nhật dữ liệu từ cả Jira và GitHub thành công.`,
        });
      } else if (!jiraRes.success && !githubRes.success) {
        toast.error("Đồng bộ thất bại", {
          description: "Không thể kết nối tới cả Jira và GitHub.",
        });
      } else {
        toast.warning("Đồng bộ một phần", {
          description: `Jira: ${jiraRes.success ? "OK" : "Lỗi"} | GitHub: ${githubRes.success ? "OK" : "Lỗi"}`,
        });
      }
    } catch (error) {
      toast.error("Lỗi không xác định khi đồng bộ dữ liệu");
    } finally {
      setIsSyncing(false);
    }
  };

  // Chỉ LEADER và MEMBER mới được truy cập
  if (role !== "LEADER" && role !== "MEMBER") {
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
            disabled={isSyncing}
            className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-full"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                Đang xử lý dữ liệu...
              </>
            ) : (
              <>
                <Zap className="mr-3 h-6 w-6 fill-yellow-300 text-yellow-100" />
                Bắt đầu Đồng bộ Tất cả
              </>
            )}
          </Button>

          {lastJiraRun && lastGithubRun && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 px-4 py-2 rounded-full border shadow-sm">
              <Clock className="h-4 w-4 text-violet-600" />
              <span>
                Lần chạy gần nhất:{" "}
                <span className="font-semibold text-gray-700">
                  {new Date(lastJiraRun).toLocaleString("vi-VN")}
                </span>
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* RESULTS GRID */}
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
              {jiraStats ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Đã cập nhật
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Chờ đồng bộ
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            {!jiraStats ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8 opacity-50">
                <LayoutList className="h-12 w-12 text-gray-300" />
                <p>Chưa có dữ liệu phiên làm việc này</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-sm text-indigo-600 font-medium mb-1">
                      Task mới
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-indigo-700">
                        {jiraStats.newIssues ?? 0}
                      </span>
                      <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      Cập nhật
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-700">
                        {jiraStats.updatedIssues ?? 0}
                      </span>
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Tổng số tasks
                  </span>
                  <span className="font-bold text-gray-800">
                    {jiraStats.totalIssues ?? "--"}
                  </span>
                </div>
              </div>
            )}
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
              {githubStats ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Đã cập nhật
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Chờ đồng bộ
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            {!githubStats ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8 opacity-50">
                <GitCommit className="h-12 w-12 text-gray-300" />
                <p>Chưa có dữ liệu phiên làm việc này</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-sm text-emerald-600 font-medium mb-1">
                      Commits mới
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-emerald-700">
                        {githubStats.newCommits ?? 0}
                      </span>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-600 font-medium mb-1">
                      Lines Code
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-700">
                        {githubStats.linesOfCode ?? 0}
                      </span>
                      <Code className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <GitCommit className="h-4 w-4" /> Tổng số commits
                  </span>
                  <span className="font-bold text-gray-800">
                    {githubStats.totalCommits ?? "--"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
