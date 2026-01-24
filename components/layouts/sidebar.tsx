"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  ArrowLeft,
  ShieldAlert,
  HelpCircle,
  BookOpen,
  Crown, // 👇 Thêm icon Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Import config
import { routeGroups, UserRole } from "./sidebar-config";
import { NavItem } from "./nav-item";
import { useProfile } from "@/features/auth/hooks/use-profile";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { data: profile } = useProfile();
  const currentRole = (profile?.user?.role as UserRole) || "STUDENT";

  // State lưu thông tin lớp học mở rộng
  const [classInfo, setClassInfo] = useState<{
    className: string;
    subject?: string;
    isStudentView: boolean;
    isLeader?: boolean; // 👇 Thêm field leader
  } | null>(null);

  useEffect(() => {
    setMounted(true);

    // --- LOGIC LẤY THÔNG TIN LỚP TỪ COOKIE CHO CẢ 2 ROLE ---
    const lecturerClass = Cookies.get("lecturer_class_name");
    const lecturerSubject = Cookies.get("lecturer_subject");

    const studentClass = Cookies.get("student_class_name");
    const studentTeam = Cookies.get("student_team_name");
    const studentIsLeader = Cookies.get("student_is_leader") === "true"; // 👇 Ép kiểu về boolean

    if (currentRole === "LECTURER" && lecturerClass) {
      setClassInfo({
        className: lecturerClass,
        subject: lecturerSubject,
        isStudentView: false,
      });
    } else if (currentRole === "STUDENT" && studentClass) {
      setClassInfo({
        className: studentClass,
        subject: studentTeam || "My Team",
        isStudentView: true,
        isLeader: studentIsLeader, // 👇 Cập nhật trạng thái leader
      });
    } else {
      setClassInfo(null);
    }
  }, [currentRole, pathname]); // Re-run khi đổi role hoặc đổi route để cập nhật cookie mới nhất

  if (!mounted) return <div className="w-full h-full bg-[#111827]" />;

  // Lọc menu theo role
  const filteredRoutes = routeGroups.filter((group) =>
    group.roles.includes(currentRole),
  );

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white border-r border-gray-800 relative">
      {/* TOGGLE BUTTON */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-8 h-6 w-6 rounded-full border bg-white text-gray-900 shadow-md hover:bg-gray-100 z-50 hidden md:flex"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* HEADER LOGO / CLASS INFO */}
      <div
        className={cn(
          "flex items-center h-16 transition-all duration-300 border-b border-gray-800/50",
          isCollapsed ? "justify-center px-2" : "justify-between px-6",
        )}
      >
        <Link
          href={
            currentRole === "LECTURER" ? "/dashboard" : "/student/dashboard"
          }
          className="flex items-center gap-3 hover:opacity-80 transition max-w-full"
        >
          <div
            className={cn(
              "relative w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl shadow-lg transition-colors",
              classInfo
                ? classInfo.isStudentView
                  ? "bg-[#F27124] shadow-orange-500/20"
                  : "bg-blue-600 shadow-blue-500/20"
                : "bg-gray-700",
            )}
          >
            {classInfo ? (
              <BookOpen className="w-5 h-5 text-white" />
            ) : (
              <Briefcase className="w-5 h-5 text-white" />
            )}
          </div>

          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <h1
                className="text-lg font-bold tracking-tight leading-none truncate"
                title={classInfo?.className || "SyncSystem"}
              >
                {classInfo ? classInfo.className : "SyncSystem"}
              </h1>
              <span
                className="text-[10px] text-gray-400 font-medium mt-1 truncate"
                title={classInfo?.subject || "Academic Management"}
              >
                {classInfo ? classInfo.subject : "Academic Management"}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* USER ROLE BADGE */}
      {!isCollapsed && (
        <div className="px-4 py-4 animate-in fade-in slide-in-from-left-5 duration-300">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50 relative overflow-hidden group">
            <div className="p-1.5 bg-gray-700 rounded-lg">
              <UserCircle className="w-4 h-4 text-gray-300" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none mb-1">
                Role
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-bold",
                    currentRole === "ADMIN"
                      ? "text-violet-400"
                      : currentRole === "LECTURER"
                        ? "text-emerald-400"
                        : "text-[#F27124]",
                  )}
                >
                  {currentRole}
                </span>

                {/* 👇 BADGE LEADER CHO SINH VIÊN */}
                {classInfo?.isLeader && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 animate-pulse">
                    <Crown className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-[9px] font-bold text-yellow-500 uppercase">
                      Leader
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hiệu ứng ánh sáng nếu là Leader */}
            {classInfo?.isLeader && (
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-yellow-500/5 blur-2xl rounded-full" />
            )}
          </div>
        </div>
      )}

      {/* MENU ITEMS */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto py-2 scrollbar-hide">
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h3 className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* FOOTER */}
      <div className="p-3 mt-auto border-t border-gray-800 bg-[#0f1623] space-y-3">
        {/* NÚT ĐỔI LỚP: Linh hoạt cho cả 2 Role */}
        {classInfo && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={
                    classInfo.isStudentView ? "/courses" : "/lecturer/courses"
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-xl bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all group shadow-sm",
                    isCollapsed ? "justify-center p-2.5" : "px-4 py-3",
                  )}
                >
                  <ArrowLeft className="w-4 h-4 text-[#F27124] group-hover:-translate-x-1 transition-transform" />
                  {!isCollapsed && (
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-white">
                        Đổi Lớp Khác
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Quay lại danh sách
                      </span>
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="bg-gray-900 border-gray-700 text-white"
                >
                  Danh sách lớp
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

        {/* System Status Section */}
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-orange-950/40 to-red-950/20 rounded-xl p-4 border border-orange-500/10">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-xs font-semibold text-gray-200">
                  Hệ thống ổn định
                </p>
                <p className="text-[10px] text-gray-500">v1.2.0 (Stable)</p>
              </div>
            </div>
            <Link
              href="#"
              className="text-[10px] text-gray-400 hover:text-[#F27124] flex items-center gap-1.5 mt-3 transition-colors pl-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Hướng dẫn sử dụng</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
