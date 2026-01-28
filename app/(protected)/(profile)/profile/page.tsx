"use client";

import { ProfileSidebar } from "@/features/auth/components/profile/profile-sidebar";
import { ProfileTabs } from "@/features/auth/components/profile/profile-tabs";
import { UserCircle, Fingerprint } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 font-mono">
      {/* 1. BENTO HEADER SECTION */}
      <div className="relative overflow-hidden p-10 rounded-[48px] bg-white border border-slate-200/60 shadow-sm transition-all hover:shadow-md group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          {/* Icon Box */}
          <div className="p-6 bg-orange-50 rounded-[32px] text-[#F27124] shadow-inner group-hover:scale-110 transition-transform duration-500">
            <UserCircle className="w-14 h-14" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
                Hồ sơ cá nhân
              </h3>
              <div className="px-3 py-1 rounded-md bg-slate-900 text-white text-[10px] font-black tracking-[0.2em] uppercase">
                VERIFIED_ACCOUNT
              </div>
            </div>
            <p className="text-slate-500 text-base font-medium uppercase tracking-wider opacity-60 max-w-2xl leading-relaxed">
              Cổng quản trị thông tin định danh, tùy chỉnh hồ sơ hiển thị và
              thiết lập bảo mật đa lớp cho tài khoản FPT của bạn.
            </p>
          </div>
        </div>

        {/* Decor: Vân tay chìm phong cách bảo mật */}
        <Fingerprint className="absolute -right-12 -bottom-12 w-80 h-80 text-slate-100 opacity-30 rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
      </div>

      {/* 2. GRID CONTENT: 3/12 (Sidebar) và 9/12 (Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI (Sticky Sidebar) */}
        <aside className="lg:col-span-3 w-full sticky top-28 z-20">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Sidebar Component giữ nguyên logic nhưng bỏ card-wrap nếu bên trong đã có Card */}
            <ProfileSidebar />
          </div>
        </aside>

        {/* CỘT PHẢI (Main Content) */}
        <div className="lg:col-span-9 w-full animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="bg-white rounded-[48px] border border-slate-200/60 p-8 md:p-12 shadow-sm min-h-[700px]">
            {/* ProfileTabs sẽ tự bung theo container cha */}
            <ProfileTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
