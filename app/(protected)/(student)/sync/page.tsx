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
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  Code,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Đồng bộ dữ liệu
            </h2>
            <p className="text-muted-foreground mt-1">
              Kích hoạt đồng bộ Jira và GitHub cho nhóm. Dữ liệu sau khi sync sẽ được dùng cho dashboard, điểm tự động và báo cáo.
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      <Tabs defaultValue="jira" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-muted/50 p-1">
            <TabsTrigger
              value="jira"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <LayoutList className="h-4 w-4" />
              <span className="font-medium">Jira</span>
            </TabsTrigger>
            <TabsTrigger
              value="github"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <GitCommit className="h-4 w-4" />
              <span className="font-medium">GitHub</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* JIRA TAB */}
        <TabsContent value="jira" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <Card className="border-2 shadow-xl overflow-hidden bg-gradient-to-br from-white to-indigo-50/30">
            {/* HEADER WITH GRADIENT */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <LayoutList className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-1">
                      Đồng bộ Jira
                    </CardTitle>
                    <p className="text-indigo-50 text-sm">
                      Lấy danh sách task mới nhất từ Jira cho dự án của nhóm bạn
                    </p>
                  </div>
                </div>
                {lastJiraRun && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Clock className="h-3 w-3 mr-1" />
                    Đã sync
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* LAST SYNC INFO */}
              {lastJiraRun && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span>
                    Lần sync gần nhất: <span className="font-semibold text-indigo-700">{new Date(lastJiraRun).toLocaleString("vi-VN")}</span>
                  </span>
                </div>
              )}

              {/* SYNC BUTTON */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span>Quá trình sync có thể mất vài giây tùy theo số lượng task</span>
                </div>
                <Button
                  size="lg"
                  onClick={handleJiraSync}
                  disabled={isSyncingJira}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                >
                  <RefreshCw
                    className={`mr-2 h-5 w-5 ${isSyncingJira ? "animate-spin" : ""}`}
                  />
                  {isSyncingJira ? "Đang Sync..." : "Bắt đầu Sync"}
                </Button>
              </div>

              {/* STATS CARDS */}
              {jiraStats && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-semibold text-base">Kết quả lần sync gần nhất</h4>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-indigo-100 shadow-sm">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Tổng số task</p>
                        <p className="text-2xl font-bold text-indigo-700">{jiraStats.totalIssues ?? "--"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-emerald-100 shadow-sm">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Task mới</p>
                        <p className="text-2xl font-bold text-emerald-700">{jiraStats.newIssues ?? 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-blue-100 shadow-sm">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <RefreshCw className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Task cập nhật</p>
                        <p className="text-2xl font-bold text-blue-700">{jiraStats.updatedIssues ?? 0}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                    Dữ liệu task sau khi sync sẽ được dùng để tính điểm tự động và hiển thị trên Dashboard của nhóm.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* GITHUB TAB */}
        <TabsContent value="github" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <Card className="border-2 shadow-xl overflow-hidden bg-gradient-to-br from-white to-slate-50/30">
            {/* HEADER WITH GRADIENT */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <GitCommit className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-1">
                      Đồng bộ GitHub
                    </CardTitle>
                    <p className="text-slate-200 text-sm">
                      Lấy danh sách commit mới nhất từ repository GitHub của nhóm bạn
                    </p>
                  </div>
                </div>
                {lastGithubRun && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Clock className="h-3 w-3 mr-1" />
                    Đã sync
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* LAST SYNC INFO */}
              {lastGithubRun && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                  <Clock className="h-4 w-4 text-slate-600" />
                  <span>
                    Lần sync gần nhất: <span className="font-semibold text-slate-700">{new Date(lastGithubRun).toLocaleString("vi-VN")}</span>
                  </span>
                </div>
              )}

              {/* SYNC BUTTON */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-slate-500" />
                  <span>Quá trình sync có thể mất vài giây tùy theo số lượng commit</span>
                </div>
                <Button
                  size="lg"
                  onClick={handleGithubSync}
                  disabled={isSyncingGithub}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                >
                  <RefreshCw
                    className={`mr-2 h-5 w-5 ${isSyncingGithub ? "animate-spin" : ""}`}
                  />
                  {isSyncingGithub ? "Đang Sync..." : "Bắt đầu Sync"}
                </Button>
              </div>

              {/* STATS CARDS */}
              {githubStats && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-semibold text-base">Kết quả lần sync gần nhất</h4>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-slate-100 shadow-sm">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <GitCommit className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Tổng số commits</p>
                        <p className="text-2xl font-bold text-slate-700">{githubStats.totalCommits ?? "--"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-emerald-100 shadow-sm">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Commits mới</p>
                        <p className="text-2xl font-bold text-emerald-700">{githubStats.newCommits ?? 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-blue-100 shadow-sm">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Code className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Lines of Code</p>
                        <p className="text-2xl font-bold text-blue-700">{githubStats.linesOfCode ?? 0}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    Dữ liệu commit sau khi sync sẽ được sử dụng để tính điểm GitHub và hiển thị trên Dashboard.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


