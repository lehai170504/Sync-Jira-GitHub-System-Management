"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  GitCommit,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Layers,
  BookOpen,
  CalendarRange,
  School,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// 1. TYPES
export type UserRole = "ADMIN" | "LECTURER" | "LEADER" | "MEMBER";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

// 2. CONFIG MENU
const routeGroups = [
  {
    label: "Tổng quan",
    roles: ["ADMIN", "LECTURER", "LEADER", "MEMBER"],
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
      },
    ],
  },
  {
    label: "Quản trị hệ thống",
    roles: ["ADMIN"],
    items: [
      {
        label: "Học kỳ & Môn học",
        icon: CalendarRange,
        href: "/admin/academic",
        color: "text-orange-500",
      },
      {
        label: "Quản lý Lớp học",
        icon: School,
        href: "/admin/classes",
        color: "text-blue-500",
      },
      {
        label: "Ánh xạ tài khoản",
        icon: Users,
        href: "/mapping",
        color: "text-pink-700",
      },
      {
        label: "Người dùng & Quyền",
        icon: ShieldAlert,
        href: "/admin/users",
        color: "text-gray-400",
      },
      {
        label: "Nhật ký hệ thống",
        icon: GitCommit,
        href: "/admin/logs",
        color: "text-red-700",
      },
    ],
  },
  {
    label: "Giảng viên",
    roles: ["LECTURER"],
    items: [
      {
        label: "Báo cáo & Điểm",
        icon: FileText,
        href: "/admin/reports",
        color: "text-emerald-500",
      },
      {
        label: "Lớp đang dạy",
        icon: BookOpen,
        href: "/lecturer/classes",
        color: "text-orange-500",
      },
    ],
  },
  {
    label: "Sinh viên",
    roles: ["LEADER", "MEMBER"],
    items: [
      {
        label: "Kết quả học tập",
        icon: Layers,
        href: "/student/my-score",
        color: "text-yellow-500",
      },
      {
        label: "Đánh giá chéo",
        icon: GraduationCap,
        href: "/student/peer-review",
        color: "text-orange-700",
      },
    ],
  },
  {
    label: "Quản lý nhóm",
    roles: ["LEADER"],
    items: [
      {
        label: "Thành viên nhóm",
        icon: Users,
        href: "/leader/members",
        color: "text-indigo-500",
      },
      {
        label: "Phân công Task",
        icon: FileText,
        href: "/leader/tasks",
        color: "text-rose-500",
      },
      {
        label: "Ánh xạ tài khoản",
        icon: Users,
        href: "/mapping",
        color: "text-pink-700",
      },
      {
        label: "Cấu hình",
        icon: Settings,
        href: "/config",
        color: "text-violet-500",
      },
    ],
  },
];

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<UserRole>("MEMBER");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const roleFromCookie = Cookies.get("user_role") as UserRole;
    if (roleFromCookie) setCurrentRole(roleFromCookie);
  }, []);

  const filteredRoutes = routeGroups.filter((group) =>
    group.roles.includes(currentRole)
  );

  if (!mounted) return <div className="w-full h-full bg-[#111827]" />;

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white border-r border-gray-800 relative">
      {/* TOGGLE BUTTON - CENTERED VERTICALLY */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border bg-white text-gray-900 shadow-md hover:bg-gray-100 z-50 hidden md:flex items-center justify-center p-0"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* 1. Header Logo */}
      <div
        className={cn(
          "flex items-center h-16 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between px-6"
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#F27124] rounded-xl shadow-lg shadow-orange-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-lg font-bold tracking-tight leading-none truncate">
                SyncSystem
              </h1>
              <span className="text-[10px] text-gray-400 font-medium mt-1 truncate">
                Project Manager
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. User Role Badge */}
      {!isCollapsed && (
        <div className="px-4 mb-2 animate-in fade-in slide-in-from-left-5 duration-300">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
            <UserCircle className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Role
              </span>
              <span
                className={`text-xs font-bold ${
                  currentRole === "ADMIN"
                    ? "text-violet-400"
                    : currentRole === "LECTURER"
                    ? "text-emerald-400"
                    : currentRole === "LEADER"
                    ? "text-blue-400"
                    : "text-yellow-400"
                }`}
              >
                {currentRole}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Menu Area */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto py-4 scrollbar-hide">
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 animate-in fade-in duration-300">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((route) => {
                  const isActive =
                    pathname === route.href ||
                    pathname.startsWith(`${route.href}/`);

                  // COMPONENT LINK CHUNG
                  const LinkContent = (
                    <Link
                      href={route.href}
                      className={cn(
                        "group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                        isCollapsed ? "justify-center px-2" : "px-4",
                        isActive
                          ? "bg-gray-800/50 text-white shadow-sm"
                          : "text-gray-400 hover:bg-gray-800/30 hover:text-white"
                      )}
                    >
                      <route.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors",
                          isActive
                            ? route.color
                            : "text-gray-500 group-hover:text-white",
                          !isCollapsed && "mr-3"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{route.label}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <div className="ml-auto w-1 h-1 rounded-full bg-[#F27124]" />
                      )}
                    </Link>
                  );

                  // NẾU THU GỌN -> WRAP TRONG TOOLTIP
                  if (isCollapsed) {
                    return (
                      <Tooltip key={route.href}>
                        <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-white text-black font-medium border-gray-200"
                        >
                          {route.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  // NẾU MỞ RỘNG -> RENDER BÌNH THƯỜNG
                  return <div key={route.href}>{LinkContent}</div>;
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* 4. Footer Section */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-gray-800 bg-[#0f1623] animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/20 rounded-lg p-4 border border-orange-500/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-orange-500/20 rounded-md">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Hệ thống ổn định
                </p>
                <p className="text-xs text-orange-200">v1.2.0</p>
              </div>
            </div>
            <Link
              href="#"
              className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 mt-2 transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Xem tài liệu hướng dẫn</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
