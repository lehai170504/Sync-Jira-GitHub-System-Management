"use client";

import { useState } from "react";
import { ReportStats } from "./report-stats";
import { GenerateReportCard } from "./generate-report-card";
import { ReportToolbar } from "./report-toolbar";
import { ReportTable } from "./report-table";
import { mockReports } from "./report-data";

export function ReportsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Logic Filter
  const filteredReports = mockReports.filter((r) => {
    const matchesSearch = r.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* 1. STATS */}
      <ReportStats reports={mockReports} />

      {/* 2. GENERATE NEW */}
      <GenerateReportCard />

      {/* 3. LIST HISTORY */}
      <div>
        <ReportToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
        <ReportTable reports={filteredReports} />
      </div>
    </div>
  );
}
