"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";
import { GitCommit, Loader2, AlertCircle } from "lucide-react";
import { mockCommits, mockCommitDetails } from "./mock-data";
import { CommitFilters } from "./commit-filters";
import { CommitListTable } from "./commit-list-table";
import { CommitDetailModal } from "./commit-detail-modal";
import { getValidation } from "./utils";
import { UserRole } from "@/components/layouts/sidebar-config";
import type { CommitItem } from "./types";
import { useTeamMembers } from "@/features/student/hooks/use-team-members";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useMyClasses } from "@/features/student/hooks/use-my-classes";
import {
  useTeamCommits,
  useMemberCommits,
} from "@/features/integration/hooks/use-team-commits";
import { useMyCommits } from "@/features/integration/hooks/use-my-commits";
import { useTeamCommitsFromTeam } from "@/features/management/teams/hooks/use-team-commits";

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
    useTeamCommitsFromTeam(resolvedTeamId, shouldFetchTeamCommitsAll);

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
    );

  const { data: myCommitsData, isLoading: isMyCommitsLoading } = useMyCommits();

  // Map dữ liệu Commits từ API về format chuẩn của UI
  const allCommits: CommitItem[] = useMemo(() => {
    let rawData = [];
    if (isLeader) {
      rawData = authorFilter === "ALL" ? teamCommitsAllData?.commits || [] : memberCommitsData?.commits || [];
    } else {
      rawData = myCommitsData?.commits || [];
    }

    if (rawData.length === 0) return mockCommits; // Fallback

    return rawData.map((c: any) => {
      // Endpoint mới: GET /teams/:teamId/commits
      if (c?.hash && c?.commit_date) {
        return {
          id: c.hash,
          message: c.message,
          author: c.author_email || "unknown",
          branch: "main",
          date: c.commit_date,
          is_counted: c.is_counted,
          rejection_reason: c.rejection_reason,
        };
      }

      // Fallback cho các endpoint cũ (integrations/*)
      return {
        id: c._id || c.id,
        message: c.message,
        author: c.author,
        branch: c.branch || "main",
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
      <div className="p-12 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Bạn chưa tham gia vào nhóm nào trong lớp học này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-slate-900 rounded-[20px] shadow-xl shadow-slate-200 text-white">
          <GitCommit className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Lịch sử Commit
          </h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {isLeader
              ? "Quản lý đóng góp mã nguồn của toàn nhóm"
              : "Xem lịch sử đóng góp cá nhân"}
          </p>
        </div>
      </div>

      <Separator className="bg-slate-100" />

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
      <div className="bg-white p-2 rounded-[24px] border border-slate-200/60 shadow-sm">
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
        />
      </div>

      {/* LIST */}
      <CommitListTable
        commits={filteredCommits}
        onCommitClick={setSelectedCommitId}
      />

      <CommitDetailModal
        open={!!selectedCommitId}
        onOpenChange={(open) => !open && setSelectedCommitId(null)}
        commit={
          selectedCommitId
            ? allCommits.find((c) => c.id === selectedCommitId)
            : undefined
        }
        detail={
          selectedCommitId ? mockCommitDetails[selectedCommitId] : undefined
        }
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
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <div
      className={`p-6 rounded-[28px] border ${colors[color]} flex justify-between items-center bg-white shadow-sm`}
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
