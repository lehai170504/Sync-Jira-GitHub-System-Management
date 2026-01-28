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
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-mono tracking-tight">
      {/* HEADER: Sticky & Glassmorphism */}
      <header className="sticky top-0 shrink-0 flex items-center justify-between px-8 border-b border-slate-200/60 h-20 bg-white/70 backdrop-blur-xl z-40">
        <div className="flex items-center gap-6">
          <Button type="button" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              QUAY LẠI
            </span>
          </Button>
          <div className="h-6 w-[1.5px] bg-slate-200" />
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#F27124]">
            CÀI_ĐẶT_NGƯỜI_DÙNG // {vietnamesePath}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <NotificationsNav />
          <div className="h-8 w-[1.5px] bg-slate-200" />
          <UserNav />
        </div>
      </header>

      {/* MAIN CONTENT: Mở rộng max-width */}
      <main className="flex-1 overflow-y-auto bg-slate-50/30 scrollbar-hide">
        <div className="max-w-[1600px] mx-auto py-10 px-6 md:px-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>

      <footer className="shrink-0 px-10 py-6 border-t border-slate-200/60 bg-white">
        <div className="max-w-[1600px] mx-auto opacity-60 hover:opacity-100 transition-opacity">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
