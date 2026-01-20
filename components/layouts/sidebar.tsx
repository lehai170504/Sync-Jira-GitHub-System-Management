"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
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
  ArrowLeftCircle,
  GitCommit,
  ClipboardList, // Icon cho Bài tập
  List, // Icon cho Danh sách
  CalendarCheck, // Icon Lịch
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export type UserRole = "ADMIN" | "LECTURER" | "LEADER" | "MEMBER";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const routeGroups = [
  // --- 1. NHÓM CHUNG (Dành cho Admin, Leader, Member) ---
  // Giảng viên sẽ KHÔNG thấy mục này để tránh nhầm lẫn với Dashboard riêng của lớp
  {
    label: "Tổng quan",
    roles: ["ADMIN", "LEADER", "MEMBER"],
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
      },
    ],
  },

  // --- 2. NHÓM GIẢNG VIÊN (Menu chuyên biệt cho lớp học) ---
  {
    label: "Quản lý Lớp học",
    roles: ["LECTURER"],
    items: [
      {
        label: "Tổng quan Lớp",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
      },

      {
        label: "Sinh viên & Nhóm",
        icon: Users,
        href: "/lecturer/class-management",
        color: "text-blue-500",
      },
      {
        label: "Bài tập & Điểm",
        icon: ClipboardList,
        href: "/lecturer/assignments",
        color: "text-emerald-500",
      },
      {
        label: "Cấu hình Lớp",
        icon: Settings,
        href: "/lecturer/settings",
        color: "text-gray-500",
      },
    ],
  },

  // --- 3. NHÓM SINH VIÊN (Leader + Member) ---
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

  // --- 4. NHÓM QUẢN LÝ TEAM (Chỉ Leader) ---
  {
    label: "Quản lý nhóm",
    roles: ["LEADER"],
    items: [
      {
        label: "Thành viên nhóm",
        icon: UserCircle,
        href: "/leader/members",
        color: "text-indigo-500",
      },
      {
        label: "Quản lý Task",
        icon: ClipboardList,
        href: "/leader/tasks",
        color: "text-rose-500",
      },
      {
        label: "Cấu hình nhóm",
        icon: Settings,
        href: "/leader/config",
        color: "text-violet-500",
      },
    ],
  },

  // --- 5. NHÓM QUẢN TRỊ VIÊN (Admin) ---
  {
    label: "Hệ thống",
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
];

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>("MEMBER");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const roleFromCookie = Cookies.get("user_role") as UserRole;
    if (roleFromCookie) setCurrentRole(roleFromCookie);
  }, []);

  // HÀM QUAY VỀ TRANG CHỌN LỚP (Reset Context lớp học)
  const handleBackToCourses = () => {
    Cookies.remove("lecturer_class_id");
    Cookies.remove("lecturer_class_name");
    Cookies.remove("lecturer_subject");
    router.push("/lecturer/courses");
  };

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

      {/* HEADER LOGO */}
      <div
        className={cn(
          "flex items-center h-16 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between px-6"
        )}
      >
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* USER ROLE BADGE */}
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

      {/* MENU ITEMS */}
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
                  // Active logic: exact match hoặc là sub-route
                  const isActive =
                    pathname === route.href ||
                    pathname.startsWith(`${route.href}/`);

                  return (
                    <Tooltip key={route.href} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link
                          key={route.href}
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
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent
                          side="right"
                          className="bg-white text-black font-medium border-gray-200"
                        >
                          {route.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* FOOTER - NÚT ĐỔI LỚP (Chỉ hiện cho Lecturer) */}
      <div className="p-4 mt-auto border-t border-gray-800 bg-[#0f1623] space-y-3">
        {currentRole === "LECTURER" &&
          (isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleBackToCourses}
                    variant="ghost"
                    size="icon"
                    className="w-full h-10 hover:bg-gray-800 text-gray-400 hover:text-white"
                  >
                    <ArrowLeftCircle className="w-5 h-5 text-[#F27124]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Đổi lớp giảng dạy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={handleBackToCourses}
              variant="outline"
              className="w-full justify-start gap-2 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:text-white text-gray-300 transition-all group"
            >
              <ArrowLeftCircle className="w-4 h-4 text-[#F27124] group-hover:text-white transition-colors" />
              <span className="text-xs font-semibold">Đổi lớp giảng dạy</span>
            </Button>
          ))}

        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-orange-500/20 rounded-md">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">System Stable</p>
              <p className="text-xs text-orange-200">v1.2.0</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
