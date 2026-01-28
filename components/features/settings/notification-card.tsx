"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, BellRing, Mail, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationSettings() {
  return (
    <div className="h-full space-y-8 p-6 font-mono">
      {/* HEADER NHỎ */}
      <div className="flex items-center gap-2 mb-2">
        <BellRing className="h-4 w-4 text-[#F27124]" />
        <span className="text-[12px] font-black uppercase tracking-widest text-slate-900">
          Cấu hình thông báo
        </span>
      </div>

      <div className="space-y-4">
        <NotificationItem
          icon={Mail}
          label="Email Digest"
          description="Gửi email tổng hợp tiến độ vào 08:00 mỗi ngày."
          defaultChecked={true}
        />

        <div className="h-px bg-slate-100 mx-2" />

        <NotificationItem
          icon={AlertTriangle}
          label="Cảnh báo rủi ro"
          description="Báo tin tức thời khi sinh viên trễ hạn nộp bài."
          defaultChecked={true}
          isWarning
        />
      </div>
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
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
      <div className="flex gap-4 items-start">
        <div
          className={cn(
            "p-2.5 rounded-xl transition-colors",
            isWarning
              ? "bg-red-50 text-red-500"
              : "bg-slate-100 text-slate-500 group-hover:bg-white shadow-sm",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <Label className="text-[13px] font-bold uppercase tracking-tight text-slate-900 cursor-pointer">
            {label}
          </Label>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase opacity-70">
            {description}
          </p>
        </div>
      </div>
      <Switch
        defaultChecked={defaultChecked}
        className="data-[state=checked]:bg-[#F27124]"
      />
    </div>
  );
}
