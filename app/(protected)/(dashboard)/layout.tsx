"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Footer } from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useProfile();
  const user = data?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFullScreenPage = ["/lecturer/courses", "/courses"].includes(pathname);

  if (isFullScreenPage) {
    return (
      <div className="min-h-screen w-full bg-slate-50/50 font-mono tracking-tight">
        {children}
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-mono tracking-tight text-slate-900">
      {/* --- SIDEBAR: FIXED --- */}
      <aside
        className={cn(
          "hidden h-full md:flex md:flex-col fixed inset-y-0 left-0 z-[80] transition-all duration-500 ease-in-out shadow-2xl bg-[#0B0F1A]",
          "overflow-visible",
          isCollapsed ? "w-[80px]" : "w-72",
        )}
      >
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </aside>

      {/* --- MAIN WRAPPER --- */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-500 ease-in-out",
          isCollapsed ? "md:ml-[80px]" : "md:ml-72",
        )}
      >
        {/* --- HEADER: STICKY TOP --- */}
        <header className="sticky top-0 shrink-0 flex items-center justify-between px-8 border-b border-slate-200/60 h-20 bg-white/70 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#F27124] rounded-full opacity-40 hidden md:block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 hidden lg:block">
              Hệ thống đồng bộ FPT //{" "}
              {pathname.split("/").pop()?.replace("-", "_").toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <NotificationsNav />
            <div className="h-8 w-[1.5px] bg-slate-200" />

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="flex flex-col items-end hidden sm:flex">
                {isLoading ? (
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24 rounded-none" />
                    <Skeleton className="h-2 w-16 rounded-none self-end" />
                  </div>
                ) : (
                  <>
                    <span className="text-[13px] font-bold leading-none group-hover:text-[#F27124] transition-colors uppercase">
                      {user?.full_name || "GUEST_USER"}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-bold mt-1 px-1.5 py-0.5 border leading-none",
                        user?.role === "ADMIN"
                          ? "text-violet-600 border-violet-200 bg-violet-50"
                          : user?.role === "LECTURER"
                            ? "text-blue-600 border-blue-200 bg-blue-50"
                            : "text-[#F27124] border-orange-200 bg-orange-50",
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

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative bg-[#F8FAFC]">
          <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-full flex flex-col">
            {/* Nội dung trang */}
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
              {children}
            </div>
          </div>
        </main>

        {/* --- FOOTER: STICKY BOTTOM --- */}
        <footer className="sticky bottom-0 shrink-0 px-8 py-4 border-t border-slate-200/60 bg-white/80 backdrop-blur-md z-40">
          <div className="max-w-[1600px] mx-auto opacity-70 hover:opacity-100 transition-opacity">
            <Footer />
          </div>
        </footer>
      </div>
    </div>
  );
}
