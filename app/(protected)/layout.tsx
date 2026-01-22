"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Footer } from "@/components/layouts/footer";
import { cn } from "@/lib/utils";

// Định nghĩa kiểu dữ liệu User để hiển thị
interface UserInfo {
  name: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  // State lưu thông tin user
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Người dùng",
    role: "MEMBER",
  });

  // Lấy thông tin user từ Cookie khi Client Mount
  useEffect(() => {
    setMounted(true);
    const name = Cookies.get("user_name");
    const role = Cookies.get("user_role");

    if (name && role) {
      setUserInfo({
        name: name,
        role: role,
      });
    }
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
          <div className="flex items-center">
            {/* Breadcrumb Area (Có thể thêm sau) */}
          </div>

          <div className="flex items-center gap-4">
            <NotificationsNav />
            <div className="h-6 w-px bg-gray-200" />

            {/* User Info (Dynamic Data) */}
            <div className="flex flex-col items-end mr-1 hidden sm:flex">
              <span className="text-sm font-semibold text-gray-700 truncate max-w-[150px]">
                {userInfo.name}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                {userInfo.role}
              </span>
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
