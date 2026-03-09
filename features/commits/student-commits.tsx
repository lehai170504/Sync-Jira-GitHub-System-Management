"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitCommit, Loader2, AlertCircle } from "lucide-react";
import { CommitFilters } from "./commit-filters";
import { CommitListTable } from "./commit-list-table";
import { CommitDetailModal } from "./commit-detail-modal";
import { CommitPatchModal } from "./commit-patch-modal";
import { getValidation } from "./utils";
import { UserRole } from "@/components/layouts/sidebar-config";
import type { CommitItem } from "./types";
import { useTeamMembers } from "@/features/student/hooks/use-team-members";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import { useMemberCommits } from "@/features/integration/hooks/use-team-commits";
import { useMyCommits } from "@/features/integration/hooks/use-my-commits";
import { useTeamCommitsFromTeam } from "@/features/management/teams/hooks/use-team-commits";
import { useIntegrationTeamCommitsGrouped } from "@/features/integration/hooks/use-team-commits-grouped";
import { useTeamDetail } from "@/features/student/hooks/use-team-detail";
import { useQuery } from "@tanstack/react-query";
import { getProjectGithubBranchesApi } from "@/features/integration/api/github-branches-api";

interface LeaderCommitsProps {
  role?: UserRole;
  isLeader?: boolean;
}

export function LeaderCommits({
  role: propRole,
  isLeader: propIsLeader,
}: LeaderCommitsProps) {
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("ALL");
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  const [leaderView, setLeaderView] = useState<"list" | "grouped">("list");
  const [groupedMemberFilter, setGroupedMemberFilter] = useState<string>("ALL");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [selectedPatchCommit, setSelectedPatchCommit] = useState<CommitItem | null>(null);

  // 1. Lấy danh sách lớp học
  const { data: myClassesData, isLoading: isClassesLoading } = useMyClasses();
  const currentStudentIdFromCookie = Cookies.get("student_id");

  // Khởi tạo selectedClassId
  useEffect(() => {
    if (!selectedClassId && myClassesData?.classes?.length) {
      const cookieClassId = Cookies.get("student_class_id");
      const found = myClassesData.classes.find(
        (c) => c.class._id === cookieClassId,
      );
      setSelectedClassId(
        found?.class._id || myClassesData.classes[0].class._id,
      );
    }
  }, [myClassesData, selectedClassId]);

  // 2. Lấy thông tin Team từ Class đã chọn
  const classId = selectedClassId || Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");

  const { data: teamsData, isLoading: isTeamLoading } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find(
    (t: any) => t.project_name === myTeamName,
  );
  const resolvedTeamId = myTeamInfo?._id;

  // 3. Lấy danh sách thành viên Team
  const { data: membersData, isLoading: isMembersLoading } =
    useTeamMembers(resolvedTeamId);

  // Xử lý thông tin người dùng hiện tại và quyền Leader
  useEffect(() => {
    if (membersData?.members && currentStudentIdFromCookie) {
      const currentMember = membersData.members.find(
        (m) => m?.student?._id === currentStudentIdFromCookie,
      );
      if (currentMember) {
        setCurrentUserId(currentMember._id);
        if (propIsLeader === undefined) {
          setIsLeaderState(currentMember.role_in_team === "Leader");
        }
      }
    }
  }, [membersData, currentStudentIdFromCookie, propIsLeader]);

  const isLeader = propIsLeader !== undefined ? propIsLeader : isLeaderState;

  const { data: teamDetailData } = useTeamDetail(resolvedTeamId);
  const projectId = teamDetailData?.project?._id;
  const repoUrl = teamDetailData?.project?.githubRepoUrl || teamDetailData?.team?.github_repo_url;
  const { data: branchesData } = useQuery({
    queryKey: ["project-github-branches", projectId],
    queryFn: () => getProjectGithubBranchesApi(projectId!),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
  const branchOptions = branchesData?.branches || [];

  // Leader UI: grouped commits by member (GET /integrations/team/:teamId/commits - grouped)
  const shouldFetchGrouped =
    isLeader && leaderView === "grouped" && !!resolvedTeamId;
  const {
    data: groupedCommitsData,
    isLoading: isGroupedLoading,
    isError: isGroupedError,
  } = useIntegrationTeamCommitsGrouped(
    resolvedTeamId,
    shouldFetchGrouped,
    branchFilter || undefined,
  );

  // Mapping dữ liệu thành viên an toàn
  const validMembers = useMemo(
    () => (membersData?.members || []).filter((m) => m && m.student),
    [membersData],
  );

  const authorToMemberIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    validMembers.forEach((m) => {
      map[m.student.full_name] = m._id;
    });
    return map;
  }, [validMembers]);

  // 4. Gọi các API Commits dựa trên quyền hạn
  const shouldFetchTeamCommitsAll =
    isLeader && authorFilter === "ALL" && !!resolvedTeamId;
  const { data: teamCommitsAllData, isLoading: isTeamCommitsAllLoading } =
    useTeamCommitsFromTeam(
      resolvedTeamId,
      shouldFetchTeamCommitsAll,
      branchFilter || undefined,
    );

  const selectedMemberId =
    authorFilter !== "ALL" ? authorToMemberIdMap[authorFilter] : undefined;
  const shouldFetchMemberCommits =
    isLeader &&
    authorFilter !== "ALL" &&
    !!resolvedTeamId &&
    !!selectedMemberId;
  const { data: memberCommitsData, isLoading: isMemberCommitsLoading } =
    useMemberCommits(
      resolvedTeamId,
      selectedMemberId,
      shouldFetchMemberCommits,
      branchFilter || undefined,
    );

  const { data: myCommitsData, isLoading: isMyCommitsLoading } = useMyCommits(
    branchFilter || undefined,
  );

  // Map dữ liệu Commits từ API về format chuẩn của UI
  const allCommits: CommitItem[] = useMemo(() => {
    let rawData = [];
    if (isLeader) {
      rawData = authorFilter === "ALL" ? teamCommitsAllData?.commits || [] : memberCommitsData?.commits || [];
    } else {
      rawData = myCommitsData?.commits || [];
    }

    if (rawData.length === 0) return [];

    return rawData.map((c: any) => {
      const branches = c.branches ?? (c.branch ? [c.branch] : ["main"]);
      const branch = branches[0] || "main";
      // Endpoint mới: GET /teams/:teamId/commits
      if (c?.hash && c?.commit_date) {
        return {
          id: c.hash,
          message: c.message,
          author: c.author_email || "unknown",
          branch,
          branches,
          jira_issues: c.jira_issues ?? [],
          date: c.commit_date,
          is_counted: c.is_counted,
          rejection_reason: c.rejection_reason,
        };
      }
      return {
        id: c._id || c.id,
        message: c.message,
        author: c.author,
        branch,
        branches,
        jira_issues: c.jira_issues ?? [],
        date: c.date,
      };
    });
  }, [
    isLeader,
    authorFilter,
    teamCommitsAllData,
    memberCommitsData,
    myCommitsData,
  ]);

  // Lọc dữ liệu hiển thị (Date range)
  const filteredCommits = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (to) to.setHours(23, 59, 59, 999);

    return allCommits.filter((c) => {
      const d = new Date(c.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [fromDate, toDate, allCommits]);

  const groupedMembers = useMemo(() => groupedCommitsData?.members_commits || [], [groupedCommitsData]);

  const groupedCommitsFlat: CommitItem[] = useMemo(() => {
    if (!groupedMembers.length) return [];
    const items: CommitItem[] = [];
    groupedMembers.forEach((mc: any) => {
      (mc?.commits || []).forEach((c: any) => {
        const branches = c.branches ?? (c.branch ? [c.branch] : ["main"]);
        items.push({
          id: c.hash,
          message: c.message,
          author: c.author_email || "unknown",
          branch: branches[0] || "main",
          branches,
          date: c.commit_date,
          is_counted: c.is_counted,
          rejection_reason: c.rejection_reason,
        });
      });
    });
    return items;
  }, [groupedMembers]);

  const groupedMemberOptions = useMemo(() => {
    return groupedMembers.map((mc: any) => {
      const m = mc?.member;
      const label =
        m?.student?.full_name ||
        m?.github_username ||
        `Member ${m?._id?.slice(-4)}`;
      return {
        id: m?._id as string,
        label,
        role: m?.role_in_team as string,
        github: m?.github_username as string | null,
        total: (mc?.total ?? (mc?.commits || []).length) as number,
      };
    });
  }, [groupedMembers]);

  const groupedCommitsForSelectedMember: CommitItem[] = useMemo(() => {
    if (!groupedMembers.length) return [];
    if (groupedMemberFilter === "ALL") return groupedCommitsFlat;
    const mc = groupedMembers.find((x: any) => x?.member?._id === groupedMemberFilter);
    if (!mc) return [];
    return (mc?.commits || []).map((c: any) => {
      const branches = c.branches ?? (c.branch ? [c.branch] : ["main"]);
      return {
        id: c.hash,
        message: c.message,
        author: c.author_email || "unknown",
        branch: branches[0] || "main",
        branches,
        date: c.commit_date,
        is_counted: c.is_counted,
        rejection_reason: c.rejection_reason,
      };
    });
  }, [groupedMembers, groupedMemberFilter, groupedCommitsFlat]);

  // Thông tin Header lọc
  const authors = useMemo(
    () =>
      validMembers
        .map((m) => m.student.full_name)
        .sort((a, b) => a.localeCompare(b, "vi")),
    [validMembers],
  );

  const leaderNames = useMemo(
    () =>
      validMembers
        .filter((m) => m.role_in_team === "Leader")
        .map((m) => m.student.full_name),
    [validMembers],
  );

  const classOptions = useMemo(
    () =>
      (myClassesData?.classes || []).map((item) => ({
        id: item.class._id,
        name: item.class.name,
        code: item.class.class_code || "",
      })),
    [myClassesData],
  );

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setAuthorFilter("ALL");
    setBranchFilter("");
  };

  // Trạng thái Loading tổng hợp
  const isLoading =
    isClassesLoading ||
    isTeamLoading ||
    isMembersLoading ||
    (shouldFetchTeamCommitsAll && isTeamCommitsAllLoading) ||
    (shouldFetchMemberCommits && isMemberCommitsLoading) ||
    (!isLeader && isMyCommitsLoading);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Đang đồng bộ dữ liệu Git...
        </p>
      </div>
    );
  }

  // Nếu không có TeamId (User chưa vào nhóm)
  if (!resolvedTeamId && !isClassesLoading) {
    return (
      <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/60 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-500 mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">
          Bạn chưa tham gia vào nhóm nào trong lớp học này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full py-8 px-4 md:px-0 animate-in fade-in duration-700 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-slate-900 rounded-[20px] shadow-xl shadow-slate-200 dark:shadow-slate-900/40 text-white">
          <GitCommit className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 uppercase">
            Lịch sử Commit
          </h2>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {isLeader
              ? "Quản lý đóng góp mã nguồn của toàn nhóm"
              : "Xem lịch sử đóng góp cá nhân"}
          </p>
        </div>
      </div>

      <Separator className="bg-slate-100 dark:bg-slate-800" />

      {isLeader ? (
        <Tabs
          value={leaderView}
          onValueChange={(v) => setLeaderView(v as "list" | "grouped")}
          className="space-y-6"
        >
          {/* TabsTrigger ở đầu trang */}
          <TabsList className="bg-muted/60 p-1 w-full md:w-fit">
            <TabsTrigger value="list">Danh sách (lọc)</TabsTrigger>
            <TabsTrigger value="grouped">Tất cả commit (theo thành viên)</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatItem
                label="Tổng commit"
                value={filteredCommits.length}
                color="blue"
              />
              <StatItem
                label="Hợp lệ"
                value={
                  filteredCommits.filter(
                    (c) => getValidation(c).status === "valid",
                  ).length
                }
                color="emerald"
              />
              <StatItem
                label="Cần kiểm tra"
                value={
                  filteredCommits.filter(
                    (c) => getValidation(c).status !== "valid",
                  ).length
                }
                color="red"
              />
            </div>

            {/* FILTERS */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm dark:shadow-none">
              <CommitFilters
                authorFilter={authorFilter}
                fromDate={fromDate}
                toDate={toDate}
                authors={authors}
                onAuthorChange={setAuthorFilter}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onReset={handleResetFilters}
                isLeader={isLeader}
                currentUserAuthorName={
                  validMembers.find(
                    (m) => m.student._id === currentStudentIdFromCookie,
                  )?.student.full_name || ""
                }
                leaderNames={leaderNames}
                classOptions={classOptions}
                selectedClassId={selectedClassId}
                onClassChange={setSelectedClassId}
                teamId={resolvedTeamId}
                branchFilter={branchFilter}
                onBranchChange={setBranchFilter}
                branchOptions={branchOptions}
              />
            </div>

            {/* LIST */}
            <CommitListTable
              commits={filteredCommits}
              onCommitClick={setSelectedCommitId}
              repoUrl={repoUrl}
              onViewPatch={setSelectedPatchCommit}
              emptyMessage={
                filteredCommits.length === 0
                  ? branchFilter
                    ? `Nhánh "${branchFilter}" chưa được đồng bộ. Vui lòng đồng bộ dữ liệu tại trang Project.`
                    : "Chưa có dữ liệu commit. Vui lòng đồng bộ dữ liệu tại trang Project."
                  : undefined
              }
            />
          </TabsContent>

          <TabsContent value="grouped" className="space-y-6">
            {isGroupedLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải commits của team...
              </div>
            ) : isGroupedError ? (
              <div className="p-6 rounded-[24px] border border-red-200 bg-red-50 text-red-900 text-sm">
                Không thể tải dữ liệu commits theo thành viên. Vui lòng thử lại.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary */}
                {groupedCommitsData?.summary && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-widest">
                        Tổng thành viên
                      </div>
                      <div className="text-2xl font-black">
                        {groupedCommitsData.summary.total_members}
                      </div>
                    </div>
                    <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-widest">
                        Tổng commits
                      </div>
                      <div className="text-2xl font-black">
                        {groupedCommitsData.summary.total_commits}
                      </div>
                    </div>
                  </div>
                )}

                {/* Filter + Single table */}
                <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-muted/30 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold truncate">Danh sách commit của team</div>
                      <div className="text-xs text-muted-foreground">
                        Lọc theo thành viên để xem commit chi tiết.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        Thành viên:
                      </span>
                      <Select value={groupedMemberFilter} onValueChange={setGroupedMemberFilter}>
                        <SelectTrigger className="h-8 w-[280px] text-xs">
                          <SelectValue placeholder="Tất cả thành viên" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL" className="text-xs">
                            Tất cả thành viên
                          </SelectItem>
                          {groupedMemberOptions.map((o) => (
                            <SelectItem key={o.id} value={o.id} className="text-xs">
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-3">
                    <CommitListTable
                      commits={groupedCommitsForSelectedMember}
                      onCommitClick={setSelectedCommitId}
                      repoUrl={repoUrl}
                      onViewPatch={setSelectedPatchCommit}
                      emptyMessage={
                        groupedCommitsForSelectedMember.length === 0
                          ? branchFilter
                            ? `Nhánh "${branchFilter}" chưa được đồng bộ. Vui lòng đồng bộ dữ liệu tại trang Project.`
                            : "Chưa có dữ liệu commit. Vui lòng đồng bộ dữ liệu tại trang Project."
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatItem label="Tổng commit" value={filteredCommits.length} color="blue" />
            <StatItem
              label="Hợp lệ"
              value={filteredCommits.filter((c) => getValidation(c).status === "valid").length}
              color="emerald"
            />
            <StatItem
              label="Cần kiểm tra"
              value={filteredCommits.filter((c) => getValidation(c).status !== "valid").length}
              color="red"
            />
          </div>

          {/* FILTERS */}
          <div className="bg-white dark:bg-slate-900 p-2 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm dark:shadow-none">
            <CommitFilters
              authorFilter={authorFilter}
              fromDate={fromDate}
              toDate={toDate}
              authors={authors}
              onAuthorChange={setAuthorFilter}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onReset={handleResetFilters}
              isLeader={isLeader}
              currentUserAuthorName={
                validMembers.find(
                  (m) => m.student._id === currentStudentIdFromCookie,
                )?.student.full_name || ""
              }
              leaderNames={leaderNames}
              classOptions={classOptions}
              selectedClassId={selectedClassId}
              onClassChange={setSelectedClassId}
              teamId={resolvedTeamId}
              branchFilter={branchFilter}
              onBranchChange={setBranchFilter}
              branchOptions={branchOptions}
            />
          </div>
          <CommitListTable
            commits={filteredCommits}
            onCommitClick={setSelectedCommitId}
            repoUrl={repoUrl}
            onViewPatch={setSelectedPatchCommit}
            emptyMessage={
              filteredCommits.length === 0
                ? branchFilter
                  ? `Nhánh "${branchFilter}" chưa được đồng bộ. Vui lòng đồng bộ dữ liệu tại trang Project.`
                  : "Chưa có dữ liệu commit. Vui lòng đồng bộ dữ liệu tại trang Project."
                : undefined
            }
          />
        </>
      )}

      <CommitDetailModal
        open={!!selectedCommitId}
        onOpenChange={(open) => !open && setSelectedCommitId(null)}
        commit={
          selectedCommitId
            ? (leaderView === "grouped"
                ? groupedCommitsFlat.find((c) => c.id === selectedCommitId)
                : allCommits.find((c) => c.id === selectedCommitId))
            : undefined
        }
        detail={undefined}
      />

      <CommitPatchModal
        open={!!selectedPatchCommit}
        onOpenChange={(open) => !open && setSelectedPatchCommit(null)}
        commit={selectedPatchCommit ?? undefined}
        repoUrl={repoUrl}
      />
    </div>
  );
}

// Component phụ cho Stats để giao diện sạch hơn
function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60",
    red: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60",
  };
  return (
    <div
      className={`p-6 rounded-[28px] border ${colors[color]} flex justify-between items-center shadow-sm dark:shadow-none`}
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
          {label}
        </p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
      </div>
      <div
        className={`p-3 rounded-2xl ${colors[color]} border-none shadow-inner`}
      >
        <GitCommit className="h-5 w-5" />
      </div>
    </div>
  );
}
