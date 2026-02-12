// src/features/admin/components/dashboard/dashboard-metrics.tsx
"use client";

import { Activity, FolderGit2, Layers, Users } from "lucide-react";
import { MetricCard } from "./metric-card";

export function DashboardMetrics() {
  return (
    <div id="metrics-grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Tổng người dùng"
        value="2,543"
        change="+12.5%"
        trend="up"
        icon={Users}
        desc="So với tháng trước"
      />
      <MetricCard
        title="Lớp học Active"
        value="128"
        change="+4"
        trend="up"
        icon={Layers} // Changed from School to Layers based on availability
        desc="Đang diễn ra học kỳ này"
      />
      <MetricCard
        title="Dự án Capstone"
        value="45"
        change="-2"
        trend="down"
        icon={FolderGit2}
        desc="Dự án đang chạy"
      />
      <MetricCard
        title="Tải hệ thống"
        value="34%"
        change="Ổn định"
        trend="neutral"
        icon={Activity}
        desc="CPU Usage trung bình"
      />
    </div>
  );
}
