"use client";

import { AppearanceSettings } from "@/features/settings/appearance-card";
import { NotificationSettings } from "@/features/settings/notification-card";
import { Settings, ToyBrick, BellDot, Cpu } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-350 mx-auto space-y-10 font-mono pb-20 transition-colors duration-300">
      {/* 1. HEADER SECTION: Phong cách Bento đồng bộ với Profile */}
      <div className="relative overflow-hidden p-10 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[32px] text-blue-600 dark:text-blue-400 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Settings className="w-14 h-14" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-slate-50 transition-colors">
                Cài đặt hệ thống
              </h1>
              <div className="px-3 py-1 rounded-md bg-[#F27124] text-white text-[10px] font-black tracking-[0.2em] uppercase">
                SYSTEM CONFIG V1.2
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium uppercase tracking-wider opacity-60 dark:opacity-80 max-w-2xl leading-relaxed transition-colors">
              Tùy biến trải nghiệm người dùng, cấu hình thông báo thời gian thực
              và quản lý các tham số vận hành cốt lõi của SyncSystem.
            </p>
          </div>
        </div>

        {/* Decor: Icon bánh răng chìm */}
        <Settings className="absolute -right-12 -bottom-12 w-80 h-80 text-slate-100 dark:text-slate-800 opacity-20 dark:opacity-30 rotate-45 pointer-events-none transition-transform duration-1000 group-hover:rotate-90" />
      </div>

      {/* 2. SETTINGS GRID: Layout 2 cột cho các cài đặt nhỏ và 1 cột cho vận hành */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Appearance Settings Box */}
        <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3 ml-4 mb-2">
            <ToyBrick className="w-4 h-4 text-[#F27124] dark:text-orange-400" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Cài đặt giao diện
            </h4>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200/60 dark:border-slate-800 p-2 shadow-sm hover:shadow-md transition-all">
            <AppearanceSettings />
          </div>
        </div>

        {/* Notification Settings Box */}
        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex items-center gap-3 ml-4 mb-2">
            <BellDot className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Thông báo thời gian thực
            </h4>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200/60 dark:border-slate-800 p-2 shadow-sm hover:shadow-md transition-all">
            <NotificationSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
