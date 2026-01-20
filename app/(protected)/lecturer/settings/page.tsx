"use client";

import { ClassSettings } from "@/components/features/lecturer/class-settings"; // Đảm bảo import đúng đường dẫn

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cấu hình Lớp học</h1>
        <p className="text-muted-foreground text-sm">
          Thiết lập kết nối Jira, GitHub và trọng số điểm
        </p>
      </div>

      {/* Component này mình đã code ở bước trước rồi, chỉ việc gọi ra thôi */}
      <ClassSettings />
    </div>
  );
}
