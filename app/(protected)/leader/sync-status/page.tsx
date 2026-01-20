"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRole } from "@/components/layouts/sidebar";
import { LayoutList, GitCommit, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeaderSyncStatusPage() {
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [jiraLastSync, setJiraLastSync] = useState<string | null>(null);
  const [githubLastSync, setGithubLastSync] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    if (savedRole) setRole(savedRole);

    if (typeof window !== "undefined") {
      const jira = window.localStorage.getItem("leader_jira_last_sync");
      const github = window.localStorage.getItem("leader_github_last_sync");
      if (jira) setJiraLastSync(jira);
      if (github) setGithubLastSync(github);
    }
  }, []);

  // Chỉ LEADER mới vào được trang này
  if (role !== "LEADER") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">
              Sync Status
            </h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để xem trạng thái đồng bộ Jira và GitHub.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với quyền <b>{role}</b>. Vui lòng chuyển sang tài khoản Leader nếu muốn xem trạng thái
            đồng bộ.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatTime = (value: string | null) =>
    value ? new Date(value).toLocaleString("vi-VN") : "Chưa từng đồng bộ";

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-7 w-7 text-[#F27124]" />
            Sync Status
          </h2>
          <p className="text-muted-foreground">
            Theo dõi lần đồng bộ gần nhất của Jira và GitHub cho dự án của nhóm bạn.
          </p>
        </div>
      </div>

      <Separator />

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-orange-500" />
              Jira Software
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">Lần sync gần nhất</div>
            <div className="text-base font-semibold">
              {formatTime(jiraLastSync)}
            </div>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/leader/jira">Đi tới Sync Jira</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-slate-900" />
              GitHub Repository
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">Lần sync gần nhất</div>
            <div className="text-base font-semibold">
              {formatTime(githubLastSync)}
            </div>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/leader/github">Đi tới Sync GitHub</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


