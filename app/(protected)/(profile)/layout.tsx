"use client";

import { usePathname } from "next/navigation";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Footer } from "@/components/layouts/footer";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const translationMap: Record<string, string> = {
    profile: "HỒ SƠ CÁ NHÂN",
    settings: "CÀI ĐẶT HỆ THỐNG",
    security: "BẢO MẬT",
    notifications: "THÔNG BÁO",
  };

  const currentPathKey = pathname.split("/").pop() || "";
  const vietnamesePath =
    translationMap[currentPathKey] ||
    currentPathKey.replace("-", " ").toUpperCase();

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-slate-950 font-mono tracking-tight transition-colors duration-300">
      {/* HEADER: Sticky & Glassmorphism */}
      <header className="sticky top-0 shrink-0 flex items-center justify-between px-8 border-b border-slate-200/60 dark:border-slate-800/60 h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-40 transition-colors duration-300">
        <div className="flex items-center gap-6">
          <Button
            type="button"
            variant="ghost"
            className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-2">
              QUAY LẠI
            </span>
          </Button>
          <div className="h-6 w-[1.5px] bg-slate-200 dark:bg-slate-800" />
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#F27124] dark:text-orange-400">
            CÀI ĐẶT NGƯỜI DÙNG // {vietnamesePath}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <NotificationsNav />
          <div className="h-8 w-[1.5px] bg-slate-200 dark:bg-slate-800" />
          <UserNav />
        </div>
      </header>

      {/* MAIN CONTENT: Mở rộng max-width */}
      <main className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30 scrollbar-hide transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto py-10 px-6 md:px-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
