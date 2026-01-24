"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";
import { GitCommit } from "lucide-react";
import { mockCommits, mockCommitDetails } from "./mock-data";
import { CommitFilters } from "./commit-filters";
import { CommitListTable } from "./commit-list-table";
import { CommitDetailModal } from "./commit-detail-modal";
import { getValidation } from "./utils";
import { UserRole } from "@/components/layouts/sidebar";
import type { CommitItem } from "./types";

// Mapping member ID to author name (from tasks mock data)
const MEMBER_ID_TO_NAME: Record<string, string> = {
  m1: "Nguyễn Văn An",
  m2: "Trần Thị Bình",
  m3: "Lê Hoàng Cường",
  m4: "Phạm Minh Dung",
};

interface LeaderCommitsProps {
  role?: UserRole; // Deprecated
  isLeader?: boolean;
}

export function LeaderCommits({ role: propRole, isLeader: propIsLeader }: LeaderCommitsProps) {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isLeaderState, setIsLeaderState] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("m2");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("ALL");
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = Cookies.get("user_role") as UserRole;
    const leaderCookie = Cookies.get("student_is_leader") === "true";
    
    // Ưu tiên prop truyền vào
    if (propIsLeader !== undefined) {
      setIsLeaderState(propIsLeader);
    } else {
      setIsLeaderState(leaderCookie);
    }

    if (savedRole) {
      setRole(savedRole);
      // Giả sử: LEADER = m1, MEMBER = m2 (logic mock cũ)
      // Bây giờ dùng logic mới:
      if (leaderCookie) {
        setCurrentUserId("m1");
      } else {
        setCurrentUserId("m2");
      }
    }
  }, [propIsLeader]);

  const isLeader = isLeaderState;
  const currentUserAuthorName = MEMBER_ID_TO_NAME[currentUserId] || "";

  const authors = useMemo(() => {
    const uniq = Array.from(new Set(mockCommits.map((c) => c.author)));
    return uniq.sort((a, b) => a.localeCompare(b, "vi"));
  }, []);

  const filteredCommits = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return mockCommits.filter((c) => {
      // MEMBER chỉ xem commits của chính họ
      if (!isLeader && c.author !== currentUserAuthorName) return false;
      // LEADER có thể filter theo author
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
  }, [fromDate, toDate, authorFilter, isLeader, currentUserAuthorName]);

  const selectedCommit = useMemo(
    () => (selectedCommitId ? mockCommits.find((c) => c.id === selectedCommitId) : undefined),
    [selectedCommitId]
  );
  const selectedDetail = selectedCommitId ? mockCommitDetails[selectedCommitId] : undefined;

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setAuthorFilter("ALL");
  };

  const totalCommits = filteredCommits.length;
  const validCommits = filteredCommits.filter((c) => getValidation(c.id).status === "valid").length;
  const invalidCommits = totalCommits - validCommits;

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

