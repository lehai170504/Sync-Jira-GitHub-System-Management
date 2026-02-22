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
import { useTheme } from "next-themes";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full space-y-8 p-6 font-mono bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
      {/* 1. THEME SELECTION */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-[#F27124] dark:text-orange-400" />
            <Label className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              Chế độ hiển thị
            </Label>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase opacity-70">
            Tùy chỉnh giao diện Sáng, Tối hoặc đồng bộ hệ thống.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-200/40 dark:border-slate-800/50">
          <ThemeButton
            icon={Sun}
            label="Light"
            isActive={theme === "light"}
            onClick={() => setTheme("light")}
          />
          <ThemeButton
            icon={Moon}
            label="Dark"
            isActive={theme === "dark"}
            onClick={() => setTheme("dark")}
          />
          <ThemeButton
            icon={Monitor}
            label="System"
            isActive={theme === "system"}
            onClick={() => setTheme("system")}
          />
        </div>
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800" />

      {/* 2. LANGUAGE SELECTION */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-[#F27124] dark:text-orange-400" />
            <Label className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              Ngôn ngữ hệ thống
            </Label>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase opacity-70">
            Thay đổi ngôn ngữ hiển thị của SyncSystem.
          </p>
        </div>

        <Select defaultValue="vi">
          <SelectTrigger className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-slate-100 font-bold text-xs uppercase tracking-tight focus:ring-[#F27124]/20 focus:border-[#F27124] transition-all">
            <SelectValue placeholder="Chọn ngôn ngữ" />
          </SelectTrigger>
          <SelectContent className="font-mono rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xl">
            <SelectItem
              value="vi"
              className="text-xs font-bold uppercase py-3 dark:text-slate-200"
            >
              Tiếng Việt (VN)
            </SelectItem>
            <SelectItem
              value="en"
              className="text-xs font-bold uppercase py-3 dark:text-slate-200"
            >
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
  onClick,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 h-20 rounded-xl transition-all duration-300",
        isActive
          ? "bg-white dark:bg-slate-800 text-[#F27124] dark:text-orange-400 shadow-md border border-slate-200/60 dark:border-slate-700 scale-[1.02]"
          : "text-slate-400 dark:text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300",
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
