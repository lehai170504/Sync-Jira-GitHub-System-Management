"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Moon, Sun, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppearanceSettings() {
  return (
    <div className="h-full space-y-8 p-6 font-mono">
      {/* 1. THEME SELECTION */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-[#F27124]" />
            <Label className="text-[12px] font-black uppercase tracking-widest text-slate-900">
              Chế độ hiển thị
            </Label>
          </div>
          <p className="text-[11px] text-slate-500 font-medium uppercase opacity-70">
            Tùy chỉnh giao diện Sáng, Tối hoặc đồng bộ hệ thống.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/40">
          <ThemeButton icon={Sun} label="Light" isActive={false} />
          <ThemeButton icon={Moon} label="Dark" isActive={true} />
          <ThemeButton icon={Monitor} label="System" isActive={false} />
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* 2. LANGUAGE SELECTION */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-[#F27124]" />
            <Label className="text-[12px] font-black uppercase tracking-widest text-slate-900">
              Ngôn ngữ hệ thống
            </Label>
          </div>
          <p className="text-[11px] text-slate-500 font-medium uppercase opacity-70">
            Thay đổi ngôn ngữ hiển thị của SyncSystem.
          </p>
        </div>

        <Select defaultValue="vi">
          <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white font-bold text-xs uppercase tracking-tight focus:ring-[#F27124]/20 focus:border-[#F27124] transition-all">
            <SelectValue placeholder="Chọn ngôn ngữ" />
          </SelectTrigger>
          <SelectContent className="font-mono rounded-xl border-slate-200 shadow-xl">
            <SelectItem value="vi" className="text-xs font-bold uppercase py-3">
              Tiếng Việt (VN)
            </SelectItem>
            <SelectItem value="en" className="text-xs font-bold uppercase py-3">
              English (US)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ThemeButton({
  icon: Icon,
  label,
  isActive,
}: {
  icon: any;
  label: string;
  isActive: boolean;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex flex-col gap-2 h-20 rounded-xl transition-all duration-300",
        isActive
          ? "bg-white text-[#F27124] shadow-md border border-slate-200/60 scale-[1.02]"
          : "text-slate-400 hover:bg-white/50 hover:text-slate-600",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5",
          isActive ? "animate-in zoom-in-75 duration-300" : "",
        )}
      />
      <span className="text-[9px] font-black uppercase tracking-widest">
        {label}
      </span>
    </Button>
  );
}
