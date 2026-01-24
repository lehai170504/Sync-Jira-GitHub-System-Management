"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// import Cookies from "js-cookie"; // ❌ Không cần dùng Cookies để lấy info nữa

import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Footer } from "@/components/layouts/footer";
import { cn } from "@/lib/utils";

// 👇 1. Import Hook lấy thông tin user (getMe)
import { useProfile } from "@/features/auth/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton"; // (Tùy chọn) Để hiện loading đẹp hơn

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

  const isFullScreenPage = pathname === "/lecturer/courses";

  if (isFullScreenPage) {
    return <div className="min-h-screen w-full bg-gray-50">{children}</div>;
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Tránh Hydration Mismatch
  if (!mounted) return null;

  return (
    <div className="h-full relative bg-gray-50/30">
      {/* SIDEBAR */}
      <div
        className={cn(
          "hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-[80px]" : "md:w-72",
        )}
      >
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <main
        className={cn(
          "flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-[80px]" : "md:pl-72",
        )}
      >
        {/* HEADER */}
        <div className="flex-none flex items-center justify-between p-4 border-b h-16 bg-white/80 backdrop-blur-md z-50 shadow-sm">
          <div className="flex items-center">{/* Breadcrumb Area */}</div>

          <div className="flex items-center gap-4">
            <NotificationsNav />
            <div className="h-6 w-px bg-gray-200" />

            <div className="flex flex-col items-end mr-1 hidden sm:flex">
              {isLoading ? (
                // Loading State (Skeleton)
                <>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </>
              ) : (
                // Data Loaded
                <>
                  <span className="text-sm font-semibold text-gray-700 truncate max-w-[150px]">
                    {user?.full_name || "Người dùng"}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    {user?.role || "MEMBER"}
                  </span>
                </>
              )}
            </div>

            <UserNav />
          </div>
        </div>

        {/* PAGE CONTENT (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </div>

        {/* FOOTER */}
        <div className="flex-none">
          <Footer />
        </div>
      </main>
    </div>
  );
}
