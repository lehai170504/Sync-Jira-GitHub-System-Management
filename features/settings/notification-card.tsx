"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationSettings() {
  return (
    <div className="space-y-4 font-mono bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
      <NotificationItem
        icon={Mail}
        label="Tóm tắt qua Email" // Đã dịch
        description="Gửi email tổng hợp tiến độ vào 08:00 mỗi ngày."
        defaultChecked={true}
      />

      <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2" />

      <NotificationItem
        icon={AlertTriangle}
        label="Cảnh báo rủi ro"
        description="Báo tin tức thời khi sinh viên trễ hạn nộp bài."
        defaultChecked={true}
        isWarning
      />
    </div>
  );
}

function NotificationItem({
  icon: Icon,
  label,
  description,
  defaultChecked,
  isWarning,
}: any) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
      <div className="flex gap-4 items-start">
        <div
          className={cn(
            "p-2.5 rounded-xl transition-colors shadow-sm",
            isWarning
              ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <Label className="text-[13px] font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 cursor-pointer">
            {label}
          </Label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase opacity-70">
            {description}
          </p>
        </div>
      </div>
      <Switch
        defaultChecked={defaultChecked}
        className="data-[state=checked]:bg-[#F27124] dark:data-[state=unchecked]:bg-slate-700"
      />
    </div>
  );
}
