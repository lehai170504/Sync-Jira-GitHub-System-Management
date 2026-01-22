"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Settings,
  FileText,
  GitCommit,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Layers,
  FileSpreadsheet,
  BookOpen,
  CalendarRange,
  School,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  LayoutList,
  Activity,
  Star,
  Settings2,
  BarChart3,
  ClipboardCheck,
  CalendarDays,
  ArrowLeft, // Icon quay lại
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

// 2. CONFIG MENU (Giữ nguyên như cũ)
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
        label: "Lịch giảng dạy",
        icon: CalendarDays,
        href: "/lecturer/schedule",
        color: "text-blue-500",
      },
      {
        label: "Lớp học của tôi",
        icon: BookOpen,
        href: "/lecturer/class-management",
        color: "text-indigo-500",
      },
      {
        label: "Bài tập & Đồ án",
        icon: Layers,
        href: "/lecturer/assignments",
        color: "text-orange-500",
      },
      {
        label: "Sổ điểm & Đánh giá",
        icon: ClipboardCheck,
        href: "/lecturer/grading",
        color: "text-emerald-500",
      },
      {
        label: "Thống kê & Báo cáo",
        icon: BarChart3,
        href: "/admin/reports",
        color: "text-rose-500",
      },
      {
        label: "Cấu hình môn học",
        icon: Settings2,
        href: "/lecturer/settings",
        color: "text-slate-500",
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
        href: "/my-score",
        color: "text-yellow-500",
      },
      {
        label: "Đánh giá chéo",
        icon: GraduationCap,
        href: "/peer-review",
        color: "text-orange-700",
      },
    ],
  },
  {
    label: "Công việc & Tiến độ",
    roles: ["MEMBER"],
    items: [
      {
        label: "Tasks của tôi",
        icon: FileText,
        href: "/tasks",
        color: "text-rose-500",
      },
      {
        label: "Lịch sử commit",
        icon: GitCommit,
        href: "/commits",
        color: "text-slate-300",
      },
    ],
  },
  {
    label: "Quản lý nhóm",
    roles: ["LEADER"],
    items: [
      {
        label: "Phân công Task",
        icon: FileText,
        href: "/tasks",
        color: "text-rose-500",
      },
      {
        label: "Tiến độ nhóm",
        icon: Activity,
        href: "/progress",
        color: "text-emerald-400",
      },
      {
        label: "Tỷ lệ đóng góp",
        icon: Layers,
        href: "/contribution",
        color: "text-yellow-500",
      },
      {
        label: "Lịch sử commit",
        icon: GitCommit,
        href: "/commits",
        color: "text-slate-300",
      },
      {
        label: "Đánh giá chéo",
        icon: Star,
        href: "/peer-review",
        color: "text-amber-500",
      },
      {
        label: "Xuất báo cáo",
        icon: FileSpreadsheet,
        href: "/export",
        color: "text-emerald-500",
      },
      {
        label: "Đồng bộ dữ liệu",
        icon: LayoutList,
        href: "/sync",
        color: "text-sky-500",
      },
      {
        label: "Cấu hình",
        icon: Settings,
        href: "/config",
        color: "text-violet-500",
      },
    ],
  },
  {
    label: "Cấu hình & Đồng bộ",
    roles: ["MEMBER"],
    items: [
      {
        label: "Đồng bộ dữ liệu",
        icon: LayoutList,
        href: "/sync",
        color: "text-sky-500",
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
      {/* TOGGLE BUTTON */}
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
          "flex items-center h-16 transition-all duration-300 border-b border-gray-800/50",
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
                Academic Management
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. User Role Badge (Đã bỏ nút Đổi lớp ở đây) */}
      {!isCollapsed && (
        <div className="px-4 py-4 animate-in fade-in slide-in-from-left-5 duration-300">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <div className="p-1.5 bg-gray-700 rounded-lg">
              <UserCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none mb-1">
                Current Role
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
      <div className="flex-1 px-3 space-y-6 overflow-y-auto py-2 scrollbar-hide">
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h3 className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 animate-in fade-in duration-300">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((route) => {
                  const isActive =
                    pathname === route.href ||
                    pathname.startsWith(`${route.href}/`);

                  const LinkContent = (
                    <Link
                      href={route.href}
                      className={cn(
                        "group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                        isCollapsed ? "justify-center px-2" : "px-4",
                        isActive
                          ? "bg-gray-800 text-white shadow-sm ring-1 ring-gray-700"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                      )}
                    >
                      <route.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors",
                          isActive
                            ? route.color
                            : "text-gray-500 group-hover:text-gray-300",
                          !isCollapsed && "mr-3"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{route.label}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F27124] shadow-[0_0_8px_#F27124]" />
                      )}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={route.href}>
                        <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-gray-900 text-white border-gray-700"
                        >
                          {route.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return <div key={route.href}>{LinkContent}</div>;
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* 4. FOOTER SECTION (Nơi chứa nút Back & Status) */}
      <div className="p-3 mt-auto border-t border-gray-800 bg-[#0f1623] space-y-3">
        {/* --- NÚT ĐỔI LỚP (LECTURER ONLY) --- */}
        {currentRole === "LECTURER" && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/lecturer/courses"
                  className={cn(
                    "flex items-center gap-3 rounded-xl bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600 transition-all group shadow-sm",
                    isCollapsed ? "justify-center p-2.5" : "px-4 py-3"
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
                  Quay lại danh sách lớp
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

        {/* --- SYSTEM STATUS (Ẩn khi thu gọn để tiết kiệm chỗ) --- */}
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-orange-950/40 to-red-950/20 rounded-xl p-4 border border-orange-500/10 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 blur-[6px] opacity-20 rounded-full"></div>
                <div className="p-1.5 bg-orange-900/40 rounded-md relative border border-orange-500/20">
                  <ShieldAlert className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-200">
                  Hệ thống ổn định
                </p>
                <p className="text-[10px] text-gray-500">
                  Version 1.2.0 (Stable)
                </p>
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
