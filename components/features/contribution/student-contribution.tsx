"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Layers } from "lucide-react";
import {
  contributionData,
  githubContribution,
  jiraContribution,
  COLORS,
} from "./mock-data";
import { ContributionPie } from "./contribution-pie";
import { ContributionSummary } from "./contribution-summary";
import { JiraContributionCard } from "./jira-contribution-card";
import { GithubContributionCard } from "./github-contribution-card";

export function LeaderContribution() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeader(leaderStatus);
  }, []);

  // Always run hooks before conditional returns to keep hook order stable
  const total = useMemo(
    () => contributionData.reduce((sum, m) => sum + m.value, 0),
    [],
  );
  const totalJiraIssues = useMemo(
    () => jiraContribution.reduce((s, m) => s + m.issues, 0),
    [],
  );
  const totalGithubCommits = useMemo(
    () => githubContribution.reduce((s, m) => s + m.commits, 0),
    [],
  );

  if (!isLeader) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Contribution Ratio</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để xem tỷ lệ đóng góp của từng thành viên.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với vai trò Member. Vui lòng liên hệ Leader nếu
            muốn xem tỷ lệ đóng góp.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-7 w-7 text-[#F27124]" />
            Contribution Ratio
          </h2>
          <p className="text-muted-foreground">
            Tỷ lệ đóng góp tổng hợp (Jira Task, Commit GitHub, Peer Review) của từng thành viên
            trong nhóm.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase">Tổng đóng góp</p>
          <p className="text-2xl font-bold">{total}%</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-5">
        <ContributionPie data={contributionData} colors={COLORS} />
        <ContributionSummary data={contributionData} colors={COLORS} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <JiraContributionCard
          data={jiraContribution}
          colors={COLORS}
          totalIssues={totalJiraIssues}
        />
        <GithubContributionCard
          data={githubContribution}
          colors={COLORS}
          totalCommits={totalGithubCommits}
        />
      </div>
    </div>
  );
}


