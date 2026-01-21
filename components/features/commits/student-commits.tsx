"use client";

import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { GitCommit } from "lucide-react";
import { mockCommits, mockCommitDetails } from "./mock-data";
import { CommitFilters } from "./commit-filters";
import { CommitListTable } from "./commit-list-table";
import { CommitDetailModal } from "./commit-detail-modal";
import type { CommitItem } from "./types";

export function LeaderCommits() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("ALL");
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);

  const authors = useMemo(() => {
    const uniq = Array.from(new Set(mockCommits.map((c) => c.author)));
    return uniq.sort((a, b) => a.localeCompare(b, "vi"));
  }, []);

  const filteredCommits = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return mockCommits.filter((c) => {
      if (authorFilter !== "ALL" && c.author !== authorFilter) return false;
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
  }, [fromDate, toDate, authorFilter]);

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 md:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GitCommit className="h-7 w-7 text-[#111827]" />
            Commit History
          </h2>
          <p className="text-muted-foreground">
            Danh sách commit gần đây, lọc theo khoảng thời gian.
          </p>
        </div>
      </div>

      <Separator />

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

