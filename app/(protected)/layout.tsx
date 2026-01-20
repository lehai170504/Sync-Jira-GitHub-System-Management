"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Footer } from "@/components/layouts/footer";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isFullScreenPage = pathname === "/lecturer/courses";

  if (isFullScreenPage) {
    return <div className="min-h-screen w-full bg-gray-50">{children}</div>;
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-full relative bg-gray-50/30">
      {/* SIDEBAR (Vẫn giữ cố định bên trái) */}
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
          // 1. Đổi min-h-screen thành h-screen (cao bằng màn hình)
          // 2. Thêm overflow-hidden để ngăn trang web cuộn (chỉ cuộn phần nội dung con)
          "flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-[80px]" : "md:pl-72",
        )}
      >
        {/* HEADER (Cố định ở trên nhờ flex layout) */}
        <div className="flex-none flex items-center justify-between p-4 border-b h-16 bg-white/80 backdrop-blur-md z-50 shadow-sm">
          <div className="flex items-center">{/* Breadcrumb */}</div>

          <div className="flex items-center gap-4">
            <NotificationsNav />
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex flex-col items-end mr-1">
              <span className="text-sm font-semibold text-gray-700">
                Nguyễn Văn A
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Admin
              </span>
            </div>
            <UserNav />
          </div>
        </div>

        {/* PAGE CONTENT (Khu vực cuộn) */}
        {/* flex-1: Chiếm hết khoảng trống giữa Header và Footer */}
        {/* overflow-y-auto: Chỉ cuộn nội dung trong khu vực này */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </div>

        {/* FOOTER (Cố định ở dưới nhờ flex layout) */}
        <div className="flex-none">
          <Footer />
        </div>
      </main>
    </div>
  );
}
