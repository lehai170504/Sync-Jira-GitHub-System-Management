"use client";

import { Activity, BookOpen, Presentation, Users } from "lucide-react";
import { MetricCard } from "./metric-card";

export function DashboardMetrics({ metrics }: { metrics?: any }) {
  return (
    <div id="metrics-grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Tổng Môn học"
        value={metrics?.total_subjects || 0}
        change="Đang Active"
        trend="neutral"
        icon={BookOpen}
        desc="Sẵn sàng giảng dạy"
      />
      <MetricCard
        title="Tổng Lớp học"
        value={metrics?.total_classes || 0}
        change="Đang Active"
        trend="up"
        icon={Presentation}
        desc="Đang diễn ra học kỳ này"
      />
      <MetricCard
        title="Người dùng Hệ thống"
        value={metrics?.total_users || 0}
        change="Verified"
        trend="up"
        icon={Users}
        desc="Đã liên kết FPT Email"
      />
      <MetricCard
        title="Tình trạng Server"
        value="Ổn định"
        change="Tải 23%"
        trend="neutral"
        icon={Activity}
        desc="Mức CPU trung bình"
      />
    </div>
  );
}
