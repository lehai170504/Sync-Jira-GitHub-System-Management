"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Menu } from "lucide-react"; // Icon để toggle sidebar
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Utility để gộp class (thường có sẵn trong Shadcn)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mặc định là thu gọn (true)
  const [isCollapsed, setIsCollapsed] = useState(true);

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
        {/* Truyền prop isCollapsed xuống Sidebar để nó ẩn/hiện text */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      {/* MAIN CONTENT */}
      <main
        className={cn(
          "h-full pb-10 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-[80px]" : "md:pl-72"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b h-16 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
       
          <div className="flex items-center">
            {/* Nút toggle sidebar (chỉ hiện trên mobile và khi thu gọn) */}
          </div>

          {/* Cụm Header bên phải */}
          <div className="flex items-center gap-4">
            {/* Nút chuông thông báo */}
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

            {/* Avatar User */}
            <UserNav />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
