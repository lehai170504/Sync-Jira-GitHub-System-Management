"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // 1. Import hook lấy đường dẫn
import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Lấy đường dẫn hiện tại
  const pathname = usePathname();

  // 3. State quản lý Sidebar (Mặc định thu gọn)
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 4. Định nghĩa các trang sẽ hiển thị Full Screen (Không có Sidebar/Header)
  const isFullScreenPage = pathname === "/lecturer/courses";

  // --- TRƯỜNG HỢP 1: FULL SCREEN (Trang chọn lớp) ---
  if (isFullScreenPage) {
    return <div className="min-h-screen w-full bg-gray-50">{children}</div>;
  }

  // --- TRƯỜNG HỢP 2: DASHBOARD CHUẨN (Có Sidebar & Header) ---
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-full relative bg-gray-50/30">
      {/* SIDEBAR CONTAINER */}
      <div
        className={cn(
          "hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-[80px]" : "md:w-72"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <main
        className={cn(
          "h-full min-h-screen pb-10 transition-all duration-300 ease-in-out",
          // Margin left thay đổi tùy theo trạng thái Sidebar
          isCollapsed ? "md:pl-[80px]" : "md:pl-72"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b h-16 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          {/* Cụm Header bên trái (Title hoặc Breadcrumb có thể thêm ở đây) */}
          <div className="flex items-center">
            {/* Để trống hoặc thêm Breadcrumb nếu cần */}
          </div>

          {/* Cụm Header bên phải */}
          <div className="flex items-center gap-4">
            <NotificationsNav />

            <div className="h-6 w-px bg-gray-200" />

            {/* Thông tin User (Hardcode tạm thời hoặc lấy từ Context/Cookie) */}
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

        {/* PAGE CONTENT */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
