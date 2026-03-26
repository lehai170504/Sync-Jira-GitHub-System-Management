"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/components/layouts/sidebar-config";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Layers } from "lucide-react";
import { toast } from "sonner";
import { ContributionPie } from "./contribution-pie";
import { ContributionSummary } from "./contribution-summary";
import { COLORS } from "./mock-data";
import type { ContributionItem } from "./types";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useTeamRanking } from "@/features/management/teams/hooks/use-team-ranking";
import { useTeamLeaderboardRealtime } from "@/features/management/teams/hooks/use-team-leaderboard-rt";

const getInitials = (name?: string) => {
  const s = (name || "").trim();
  if (!s) return "NA";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function LeaderContribution() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeader, setIsLeader] = useState(false);
  const warnedMissingLeaderboardFieldsRef = useRef(false);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderStatus = Cookies.get("student_is_leader") === "true";
    
    if (savedRole) setRole(savedRole);
    setIsLeader(leaderStatus);
  }, []);

  // Resolve teamId giống trang /progress và /tasks
  const classId = Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  const { data: teamsData } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find((t: any) => t.project_name === myTeamName);
  const resolvedTeamId = myTeamInfo?._id || teamsData?.teams?.[0]?._id;

  // Member list từ API
  const { data: rankingData, isLoading: isRankingLoading } = useTeamRanking(resolvedTeamId);

  // % đóng góp realtime từ Socket.IO event `LEADERBOARD_UPDATED`
  const { data: leaderboardRt } = useTeamLeaderboardRealtime(resolvedTeamId);

  const contributionPercentByMemberId = useMemo(() => {
    const rows = leaderboardRt?.leaderboard;
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const map = new Map<string, number>();
    for (const raw of rows) {
      const r: any = raw;
      const memberId: string | undefined =
        r?.member_id ?? r?.memberId ?? r?.team_member_id ?? r?.teamMemberId;
      const percentRaw =
        r?.contribution_percent ??
        r?.contributionPercent ??
        r?.contribution_percentage ??
        r?.contributionPercentage ??
        r?.percent ??
        r?.percentage;
      const percent =
        typeof percentRaw === "number"
          ? percentRaw
          : typeof percentRaw === "string"
            ? Number(percentRaw)
            : NaN;
      if (memberId && Number.isFinite(percent)) map.set(memberId, percent);
    }

    if (map.size === 0) return { map, ok: false as const };
    return { map, ok: true as const };
  }, [leaderboardRt]);

  useEffect(() => {
    if (!contributionPercentByMemberId) return;
    if (contributionPercentByMemberId.ok) return;
    if (warnedMissingLeaderboardFieldsRef.current) return;
    warnedMissingLeaderboardFieldsRef.current = true;
    toast.warning("Payload LEADERBOARD_UPDATED thiếu field để map % đóng góp", {
      description:
        "Cần `member_id` (hoặc tương đương) và `contribution_percent` (hoặc tương đương) cho từng entry.",
    });
  }, [contributionPercentByMemberId]);

  const contributionData = useMemo<ContributionItem[]>(() => {
    const rows = rankingData?.ranking;
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const items = rows.map((member: any) => {
      const memberId = member.member_id as string;
      const name = member.student?.full_name || `Member ${memberId.slice(-4)}`;
      const initials = getInitials(name);
      const value =
        contributionPercentByMemberId && contributionPercentByMemberId.ok
          ? contributionPercentByMemberId.map.get(memberId) ?? 0
          : 0;
      return { id: memberId, name, initials, value };
    });

    // Sort giảm dần để chart/summary nhìn “đã”
    items.sort((a, b) => b.value - a.value);
    return items;
  }, [rankingData, contributionPercentByMemberId]);

  const total = useMemo(
    () => contributionData.reduce((sum, m) => sum + (Number.isFinite(m.value) ? m.value : 0), 0),
    [contributionData],
  );

  if (!isLeader) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Contribution Ratio</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Leader để xem tỷ lệ đóng góp của từng thành viên.
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-gray-50 border-gray-200 text-gray-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-100">
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn đang đăng nhập với vai trò Member. Vui lòng liên hệ Leader nếu
            muốn xem tỷ lệ đóng góp.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isRankingLoading || !resolvedTeamId) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Layers className="h-7 w-7 text-[#F27124]" />
              Contribution Ratio
            </h2>
            <p className="text-muted-foreground">
              Đang tải dữ liệu đóng góp của team...
            </p>
          </div>
        </div>
        <Separator />
        <Alert className="bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-100">
          <AlertTitle>Đang tải</AlertTitle>
          <AlertDescription>
            Vui lòng chờ trong giây lát.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0 text-slate-900 dark:text-slate-100">
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
    </div>
  );
}


