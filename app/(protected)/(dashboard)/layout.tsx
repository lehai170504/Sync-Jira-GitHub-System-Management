"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Footer } from "@/components/layouts/footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton";

// IMPORT BONG BÓNG CHAT AI
import { OmniAgentChat } from "@/features/lecturer/components/omni-agent-chat";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Dùng useSearchParams để bắt sự thay đổi URL
  const searchParams = useSearchParams();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);

  const { data, isLoading } = useProfile();
  const user = data?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const urlClassId = searchParams.get("classId");

    const cookieClassId = Cookies.get("lecturer_class_id");

    if (urlClassId) {
      setActiveClassId(urlClassId);
      Cookies.set("lecturer_class_id", urlClassId); // Lưu ngược lại cookie cho chắc
    } else if (cookieClassId) {
      setActiveClassId(cookieClassId);
    }
  }, [pathname, searchParams, mounted]);

  const isFullScreenPage = ["/lecturer/courses", "/courses"].includes(pathname);

  if (isFullScreenPage) {
    return (
      <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-900 font-mono tracking-tight">
        {children}
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-mono tracking-tight text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      {/* --- SIDEBAR --- */}
      <aside
        className={cn(
          "hidden h-full md:flex md:flex-col fixed inset-y-0 left-0 z-[80] transition-all duration-500 ease-in-out shadow-2xl bg-[#0B0F1A] dark:bg-black border-r dark:border-slate-800",
          "overflow-visible",
          isCollapsed ? "w-[80px]" : "w-72"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </aside>

      {/* --- MAIN WRAPPER --- */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-500 ease-in-out",
          isCollapsed ? "md:ml-[80px]" : "md:ml-72"
        )}
      >
        {/* --- HEADER --- */}
        <header className="sticky top-0 shrink-0 flex items-center justify-between px-8 border-b border-slate-200/60 dark:border-slate-800 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-40 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#F27124] rounded-full opacity-40 hidden md:block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 hidden lg:block">
              Hệ thống đồng bộ FPT //{" "}
              {pathname.split("/").pop()?.replace("-", "_").toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationsNav />
            <div className="h-8 w-[1.5px] bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="flex flex-col items-end hidden sm:flex">
                {isLoading ? (
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24 rounded-none" />
                    <Skeleton className="h-2 w-16 rounded-none self-end" />
                  </div>
                ) : (
                  <>
                    <span className="text-[13px] font-bold leading-none group-hover:text-[#F27124] transition-colors uppercase text-slate-900 dark:text-slate-100">
                      {user?.full_name || "GUEST_USER"}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-bold mt-1 px-1.5 py-0.5 border leading-none rounded-sm",
                        user?.role === "ADMIN"
                          ? "text-violet-600 border-violet-200 bg-violet-50 dark:bg-violet-900/30 dark:border-violet-800 dark:text-violet-300"
                          : user?.role === "LECTURER"
                          ? "text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300"
                          : "text-[#F27124] border-orange-200 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300"
                      )}
                    >
                      {user?.role || "STUDENT"}
                    </span>
                  </>
                )}
              </div>
              <UserNav />
            </div>
          </div>
        </header>

        {/* --- SCROLLABLE CONTENT --- */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
          <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-full flex flex-col">
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
              {children}
            </div>
          </div>
        </main>

        {/* --- FOOTER --- */}
        <footer className="sticky bottom-0 shrink-0 px-8 py-4 border-t border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto opacity-70 hover:opacity-100 transition-opacity">
            <Footer />
          </div>
        </footer>
      </div>

      {/* --- OMNI AGENT CHAT BOT --- */}
      {/* Chỉ render nếu đang có classId (tức là giảng viên đang ở trong ngữ cảnh 1 lớp cụ thể) */}
      {/* {activeClassId && <OmniAgentChat classId={activeClassId} />} */}
    </div>
  );
}
