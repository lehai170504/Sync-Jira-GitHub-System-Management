"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { LogStats } from "@/components/features/system/logs/log-stats";
import { LogToolbar } from "@/components/features/system/logs/log-toolbar";
import { LogTimeline } from "@/components/features/system/logs/log-timeline";
import { mockLogs } from "@/components/features/system/logs/log-data";

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Logic lọc dữ liệu được thực hiện ở trang cha
  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "All" || log.status === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Nhật ký hệ thống
        </h2>
        <p className="text-muted-foreground text-lg">
          Giám sát hoạt động, theo dõi bảo mật và kiểm tra lỗi vận hành của
          SyncSystem.
        </p>
      </div>

      <Separator />

      {/* STATS */}
      <LogStats />

      {/* MAIN CONTENT */}
      <div className="space-y-6">
        <LogToolbar onSearch={setSearchTerm} onFilter={setFilterType} />
        <LogTimeline logs={filteredLogs} />
      </div>
    </div>
  );
}
