"use client";

import { AppearanceSettings } from "@/components/features/settings/appearance-card";
import { NotificationSettings } from "@/components/features/settings/notification-card";
import { OperationalSettings } from "@/components/features/settings/operational-card";
import { Settings, ToyBrick, BellDot, Cpu } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-10 font-mono pb-20">
      {/* 1. HEADER SECTION: Phong cách Bento đồng bộ với Profile */}
      <div className="relative overflow-hidden p-10 rounded-[48px] bg-white border border-slate-200/60 shadow-sm transition-all hover:shadow-md group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="p-6 bg-blue-50 rounded-[32px] text-blue-600 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Settings className="w-14 h-14" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
                Cài đặt hệ thống
              </h1>
              <div className="px-3 py-1 rounded-md bg-[#F27124] text-white text-[10px] font-black tracking-[0.2em] uppercase">
                SYSTEM_CONFIG_V1.2
              </div>
            </div>
            <p className="text-slate-500 text-base font-medium uppercase tracking-wider opacity-60 max-w-2xl leading-relaxed">
              Tùy biến trải nghiệm người dùng, cấu hình thông báo thời gian thực
              và quản lý các tham số vận hành cốt lõi của SyncSystem.
            </p>
          </div>
        </div>

        {/* Decor: Icon bánh răng chìm */}
        <Settings className="absolute -right-12 -bottom-12 w-80 h-80 text-slate-100 opacity-20 rotate-45 pointer-events-none transition-transform duration-1000 group-hover:rotate-90" />
      </div>

      {/* 2. SETTINGS GRID: Layout 2 cột cho các cài đặt nhỏ và 1 cột cho vận hành */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Appearance Settings Box */}
        <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3 ml-4 mb-2">
            <ToyBrick className="w-4 h-4 text-[#F27124]" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              UI_APPEARANCE_SETTINGS
            </h4>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-200/60 p-2 shadow-sm hover:shadow-md transition-all">
            <AppearanceSettings />
          </div>
        </div>

        {/* Notification Settings Box */}
        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex items-center gap-3 ml-4 mb-2">
            <BellDot className="w-4 h-4 text-blue-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              REALTIME_NOTIFICATIONS
            </h4>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-200/60 p-2 shadow-sm hover:shadow-md transition-all">
            <NotificationSettings />
          </div>
        </div>

        {/* Operational Settings (Full Width) */}
        <div className="lg:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-3 ml-4 mb-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              SYSTEM_OPERATIONAL_PARAMETERS
            </h4>
          </div>
          <div className="bg-white rounded-[48px] border border-slate-200/60 p-6 md:p-10 shadow-sm hover:shadow-md transition-all">
            <OperationalSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
