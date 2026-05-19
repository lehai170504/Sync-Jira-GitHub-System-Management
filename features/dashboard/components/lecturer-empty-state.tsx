"use client";

import { UserPlus } from "lucide-react";

export function LecturerEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-white/50 dark:bg-slate-900/30">
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full shadow-sm mb-6 border border-blue-100 dark:border-blue-800">
        <UserPlus className="w-12 h-12 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
        Lớp học hiện tại chưa có sinh viên
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
        Hệ thống AI cần dữ liệu hoạt động của sinh viên để tiến hành phân
        tích. Vui lòng điều hướng tới tab{" "}
        <strong>Quản lý Thành viên</strong> để thêm sinh viên vào danh sách
        lớp!
      </p>
    </div>
  );
}
