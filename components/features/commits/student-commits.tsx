"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";
import { GitCommit, Loader2 } from "lucide-react";
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
import { useTeamCommits, useMemberCommits } from "@/features/integration/hooks/use-team-commits";
import { useMyCommits } from "@/features/integration/hooks/use-my-commits";

interface LeaderCommitsProps {
  role?: UserRole; // Deprecated
  isLeader?: boolean;
}

export function LeaderCommits({ role: propRole, isLeader: propIsLeader }: LeaderCommitsProps) {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("ALL");
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);

  // API calls - Lấy danh sách classes
  const { data: myClassesData, isLoading: isClassesLoading } = useMyClasses();
  const currentStudentId = Cookies.get("student_id");

  // Lấy classId từ selectedClassId hoặc cookie
  const classId = selectedClassId || Cookies.get("student_class_id") || "";
  const myTeamName = Cookies.get("student_team_name");
  
  const { data: teamsData, isLoading: isTeamLoading } = useClassTeams(classId);
  const myTeamInfo = teamsData?.teams?.find(
    (t: any) => t.project_name === myTeamName
  );
  const resolvedTeamId = myTeamInfo?._id;
  
  const { data: membersData, isLoading: isMembersLoading } = useTeamMembers(resolvedTeamId);

  // Khởi tạo selectedClassId từ cookie hoặc class đầu tiên
  useEffect(() => {
    if (!selectedClassId && myClassesData?.classes && myClassesData.classes.length > 0) {
      const cookieClassId = Cookies.get("student_class_id");
      const foundClass = myClassesData.classes.find(
        (c) => c.class._id === cookieClassId
      );
      if (foundClass) {
        setSelectedClassId(foundClass.class._id);
      } else {
        // Nếu không tìm thấy class trong cookie, chọn class đầu tiên
        setSelectedClassId(myClassesData.classes[0].class._id);
      }
    }
  }, [myClassesData, selectedClassId]);

  // Set teamId khi đã có data
  useEffect(() => {
    if (resolvedTeamId) {
      setTeamId(resolvedTeamId);
    }
  }, [resolvedTeamId]);

  // Lấy currentUserId và isLeader từ members data
  useEffect(() => {
    if (membersData?.members && currentStudentId) {
      const currentMember = membersData.members.find(
        (m) => m.student._id === currentStudentId
      );
      if (currentMember?._id) {
        setCurrentUserId(currentMember._id);
        // Đánh dấu isLeader từ API data (role_in_team === "Leader")
        const memberIsLeader = currentMember.role_in_team === "Leader";
        if (propIsLeader === undefined) {
          setIsLeaderState(memberIsLeader);
        }
      }
    }
  }, [membersData, currentStudentId, propIsLeader]);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderCookie = Cookies.get("student_is_leader") === "true";
    
    // Ưu tiên prop truyền vào
    if (propIsLeader !== undefined) {
      setIsLeaderState(propIsLeader);
    } else if (!membersData?.members) {
      // Chỉ dùng cookie nếu chưa có API data
      setIsLeaderState(leaderCookie);
    }

    if (savedRole) {
      setRole(savedRole);
    }
  }, [propIsLeader, membersData]);

  const isLeader = isLeaderState;

  // Tạo mapping từ author name sang memberId
  const authorToMemberIdMap = useMemo(() => {
    if (!membersData?.members) return {};
    const map: Record<string, string> = {};
    membersData.members.forEach((member) => {
      map[member.student.full_name] = member._id; // Map tên thành viên sang memberId
    });
    return map;
  }, [membersData]);

  // Gọi API team commits khi isLeader và authorFilter === "ALL"
  const shouldFetchTeamCommits = isLeader && authorFilter === "ALL" && !!resolvedTeamId;
  const { data: teamCommitsData, isLoading: isTeamCommitsLoading } = useTeamCommits(
    resolvedTeamId,
    shouldFetchTeamCommits
  );

  // Gọi API member commits khi isLeader và authorFilter !== "ALL"
  const selectedMemberId = authorFilter !== "ALL" ? authorToMemberIdMap[authorFilter] : undefined;
  const shouldFetchMemberCommits = isLeader && authorFilter !== "ALL" && !!resolvedTeamId && !!selectedMemberId;
  const { data: memberCommitsData, isLoading: isMemberCommitsLoading } = useMemberCommits(
    resolvedTeamId,
    selectedMemberId,
    shouldFetchMemberCommits
  );

  // Gọi API my-commits khi không phải isLeader (MEMBER)
  const shouldFetchMyCommits = !isLeader;
  const { data: myCommitsData, isLoading: isMyCommitsLoading } = useMyCommits();

  // Tạo mapping từ API members data (giống /project)
  const memberNameMap = useMemo(() => {
    if (!membersData?.members) return {};
    const map: Record<string, string> = {};
    membersData.members.forEach((member) => {
      // Map theo member._id (member ID) và student._id (student ID)
      map[member._id] = member.student.full_name;
      map[member.student._id] = member.student.full_name;
    });
    return map;
  }, [membersData]);

  const currentUserAuthorName = currentUserId ? memberNameMap[currentUserId] || "" : "";

  // Lấy danh sách authors từ members data
  const authors = useMemo(() => {
    if (membersData?.members && membersData.members.length > 0) {
      // Lấy tên từ members API
      const memberNames = membersData.members.map((m) => m.student.full_name);
      return memberNames.sort((a, b) => a.localeCompare(b, "vi"));
    }
    // Fallback về mock data nếu chưa có API data
    const uniq = Array.from(new Set(mockCommits.map((c) => c.author)));
    return uniq.sort((a, b) => a.localeCompare(b, "vi"));
  }, [membersData]);

  // Lấy danh sách tên các leader để đánh dấu
  const leaderNames = useMemo(() => {
    if (!membersData?.members) return [];
    return membersData.members
      .filter((m) => m.role_in_team === "Leader")
      .map((m) => m.student.full_name);
  }, [membersData]);

  // Map API team commits sang format CommitItem
  const apiTeamCommits: CommitItem[] = useMemo(() => {
    if (!teamCommitsData?.commits) return [];
    return teamCommitsData.commits.map((commit) => ({
      id: commit._id,
      message: commit.message,
      author: commit.author,
      branch: commit.branch,
      date: commit.date,
    }));
  }, [teamCommitsData]);

  // Map API member commits sang format CommitItem
  const apiMemberCommits: CommitItem[] = useMemo(() => {
    if (!memberCommitsData?.commits) return [];
    return memberCommitsData.commits.map((commit) => ({
      id: commit._id,
      message: commit.message,
      author: commit.author,
      branch: commit.branch,
      date: commit.date,
    }));
  }, [memberCommitsData]);

  // Map API my-commits sang format CommitItem (cho MEMBER)
  const apiMyCommits: CommitItem[] = useMemo(() => {
    if (!myCommitsData?.commits) return [];
    return myCommitsData.commits.map((commit: any) => ({
      id: commit._id,
      message: commit.message,
      author: commit.author,
      branch: commit.branch,
      date: commit.date,
    }));
  }, [myCommitsData]);

  // Sử dụng commits từ API nếu có, fallback về mock data
  const allCommits = useMemo(() => {
    // Nếu là LEADER và filter "ALL", dùng API team commits
    if (isLeader && authorFilter === "ALL" && apiTeamCommits.length > 0) {
      return apiTeamCommits;
    }
    // Nếu là LEADER và filter theo author cụ thể, dùng API member commits
    if (isLeader && authorFilter !== "ALL" && apiMemberCommits.length > 0) {
      return apiMemberCommits;
    }
    // Nếu là MEMBER, dùng API my-commits
    if (!isLeader && apiMyCommits.length > 0) {
      return apiMyCommits;
    }
    // Fallback về mock
    return mockCommits;
  }, [isLeader, authorFilter, apiTeamCommits, apiMemberCommits, apiMyCommits]);

  const filteredCommits = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return allCommits.filter((c) => {
      // MEMBER chỉ xem commits của chính họ
      if (!isLeader && c.author !== currentUserAuthorName) return false;
      // LEADER có thể filter theo author (đã filter ở allCommits nếu dùng API)
      if (isLeader && authorFilter !== "ALL" && c.author !== authorFilter) return false;
      const d = new Date(c.date);
      if (from && d < from) return false;
      if (to) {
        // include end date
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        if (d > toEnd) return false;
      }
      return true;
    });
  }, [fromDate, toDate, authorFilter, isLeader, currentUserAuthorName, allCommits]);

  const selectedCommit = useMemo(
    () => (selectedCommitId ? allCommits.find((c) => c.id === selectedCommitId) : undefined),
    [selectedCommitId, allCommits]
  );
  const selectedDetail = selectedCommitId ? mockCommitDetails[selectedCommitId] : undefined;

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setAuthorFilter("ALL");
    // Reset class về class đầu tiên hoặc class từ cookie
    if (myClassesData?.classes && myClassesData.classes.length > 0) {
      const cookieClassId = Cookies.get("student_class_id");
      const foundClass = myClassesData.classes.find(
        (c) => c.class._id === cookieClassId
      );
      setSelectedClassId(foundClass?.class._id || myClassesData.classes[0].class._id);
    }
  };

  // Lấy danh sách classes để hiển thị trong dropdown
  const classOptions = useMemo(() => {
    if (!myClassesData?.classes) return [];
    return myClassesData.classes.map((item) => ({
      id: item.class._id,
      name: item.class.name,
      code: item.class.class_code || "",
    }));
  }, [myClassesData]);

  const totalCommits = filteredCommits.length;
  const validCommits = filteredCommits.filter((c) => getValidation(c.id).status === "valid").length;
  const invalidCommits = totalCommits - validCommits;

  // Loading state
  if (
    isClassesLoading ||
    isTeamLoading ||
    isMembersLoading ||
    (shouldFetchTeamCommits && isTeamCommitsLoading) ||
    (shouldFetchMemberCommits && isMemberCommitsLoading) ||
    (shouldFetchMyCommits && isMyCommitsLoading)
  ) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <GitCommit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Lịch sử Commit
            </h2>
            <p className="text-muted-foreground mt-1">
              Xem và quản lý tất cả các commit của nhóm theo thời gian
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Tổng số commit</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalCommits}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <GitCommit className="h-5 w-5 text-blue-700" />
            </div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-medium">Commit hợp lệ</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{validCommits}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-lg">
              <GitCommit className="h-5 w-5 text-emerald-700" />
            </div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Commit bị loại</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{invalidCommits}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <GitCommit className="h-5 w-5 text-red-700" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
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
        currentUserAuthorName={currentUserAuthorName}
        leaderNames={leaderNames}
        classOptions={classOptions}
        selectedClassId={selectedClassId}
        onClassChange={setSelectedClassId}
        teamId={resolvedTeamId}
      />

      {/* COMMIT LIST */}
      <CommitListTable commits={filteredCommits} onCommitClick={setSelectedCommitId} />

      {/* COMMIT DETAIL MODAL */}
      <CommitDetailModal
        open={!!selectedCommitId}
        onOpenChange={(open) => !open && setSelectedCommitId(null)}
        commit={selectedCommit}
        detail={selectedDetail}
      />
    </div>
  );
}

