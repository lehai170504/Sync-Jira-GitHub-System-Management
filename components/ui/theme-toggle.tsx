"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      // Logic chuyển đổi nhanh: Nếu đang Dark thì sang Light và ngược lại
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative rounded-xl border-slate-200 bg-white/50 hover:bg-white hover:border-orange-200 hover:text-[#F27124] hover:shadow-lg hover:shadow-orange-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:hover:text-[#F27124] transition-all duration-500 group"
    >
      {/* Icon Mặt Trời: Xoay và Phóng to khi Light, Xoay đi và Thu nhỏ khi Dark */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-slate-500 group-hover:text-[#F27124]" />

      {/* Icon Mặt Trăng: Xoay đến và Phóng to khi Dark, Xoay đi và Thu nhỏ khi Light */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-slate-500 dark:text-slate-400 group-hover:text-[#F27124]" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
