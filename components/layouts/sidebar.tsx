"use client";

import { useEffect, useState } from "react"; // 1. Bỏ Activity ở đây
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
  Layers,
  FileSpreadsheet,
  BookOpen,
  CalendarRange,
  School,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  ArrowLeftCircle,
  GitCommit,
  ClipboardList,
  CalendarCheck,
  Gavel,
  LayoutList,
  Clock,
  Activity, // 2. Thêm Activity vào đây
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
  // --- 1. NHÓM CHUNG ---
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

  // --- 2. NHÓM GIẢNG VIÊN ---
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

  // --- 3. NHÓM SINH VIÊN ---
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

  // --- 4. NHÓM QUẢN LÝ TEAM ---
  {
    label: "Quản lý nhóm",
    roles: ["LEADER"],
    items: [
      {
        label: "Quản lý Task",
        icon: ClipboardList,
        href: "/leader/tasks",
        color: "text-rose-500",
      },
      {
        label: "Tiến độ nhóm",
        icon: Activity, // Icon Activity giờ sẽ hoạt động đúng
        href: "/leader/progress",
        color: "text-emerald-400",
      },
      {
        label: "Tỷ lệ đóng góp",
        icon: Layers,
        href: "/leader/contribution",
        color: "text-yellow-500",
      },
      {
        label: "Xuất bảng điểm",
        icon: FileSpreadsheet,
        href: "/leader/export-score",
        color: "text-emerald-500",
      },
      {
        label: "Export Worklog",
        icon: FileText,
        href: "/leader/export-worklog",
        color: "text-blue-400",
      },
      {
        label: "Preview Report",
        icon: FileText,
        href: "/leader/preview-report",
        color: "text-slate-300",
      },
      {
        label: "Đồng bộ Jira",
        icon: LayoutList,
        href: "/leader/jira",
        color: "text-sky-500",
      },
      {
        label: "Đồng bộ GitHub",
        icon: GitCommit,
        href: "/leader/github",
        color: "text-slate-300",
      },
      {
        label: "Trạng thái Sync",
        icon: Clock,
        href: "/leader/sync-status",
        color: "text-emerald-400",
      },
    ],
  },

  // --- 5. NHÓM QUẢN TRỊ VIÊN ---
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
        label: "Quản lý Đề tài",
        icon: FileText,
        href: "/admin/topics",
        color: "text-emerald-500",
      },
      {
        label: "Hội đồng bảo vệ",
        icon: Gavel,
        href: "/admin/councils",
        color: "text-purple-600",
      },
      {
        label: "Người dùng & Quyền",
        icon: ShieldAlert,
        href: "/admin/users",
        color: "text-gray-500",
      },
      {
        label: "Nhật ký hệ thống",
        icon: GitCommit,
        href: "/admin/logs",
        color: "text-red-600",
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

  const handleBackToCourses = () => {
    Cookies.remove("lecturer_class_id");
    Cookies.remove("lecturer_class_name");
    Cookies.remove("lecturer_subject");
    router.push("/lecturer/courses");
  };

  const filteredRoutes = routeGroups.filter((group) =>
    group.roles.includes(currentRole),
  );

  if (!mounted) return <div className="w-full h-full bg-[#111827]" />;

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white border-r border-gray-800 relative transition-all duration-300">
      {/* TOGGLE BUTTON */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-8 h-6 w-6 rounded-full border bg-white text-gray-900 shadow-md hover:bg-gray-100 z-50 hidden md:flex items-center justify-center p-0"
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
          "flex items-center h-16 transition-all duration-300 border-b border-gray-800/50",
          isCollapsed ? "justify-center px-2" : "justify-between px-6",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#F27124] rounded-xl shadow-lg shadow-orange-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
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
        <div className="px-4 py-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm">
            <div className="p-1.5 bg-gray-700/50 rounded-lg">
              <UserCircle className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
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

      {/* MENU ITEMS */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto py-2 scrollbar-none hover:scrollbar-thin scrollbar-thumb-gray-800">
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h3 className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 animate-in fade-in duration-300">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((route) => {
                  const isActive =
                    pathname === route.href ||
                    pathname.startsWith(`${route.href}/`);

                  return (
                    <Tooltip key={route.href} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link
                          href={route.href}
                          className={cn(
                            "group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                            isCollapsed ? "justify-center px-2" : "px-4",
                            isActive
                              ? "bg-gray-800 text-white shadow-md shadow-gray-900/10"
                              : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200",
                          )}
                        >
                          {/* Active Indicator Bar */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F27124]" />
                          )}

                          <route.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0 transition-colors",
                              isActive
                                ? route.color
                                : "text-gray-500 group-hover:text-gray-300",
                              !isCollapsed && "mr-3",
                            )}
                          />
                          {!isCollapsed && (
                            <span className="truncate">{route.label}</span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent
                          side="right"
                          className="bg-gray-900 text-white border-gray-700 font-medium ml-2"
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

      {/* FOOTER - NÚT ĐỔI LỚP */}
      <div className="p-4 mt-auto border-t border-gray-800 bg-[#0f1623]">
        {currentRole === "LECTURER" ? (
          isCollapsed ? (
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
                <TooltipContent
                  side="right"
                  className="bg-gray-900 text-white border-gray-700"
                >
                  Đổi lớp giảng dạy
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={handleBackToCourses}
              variant="outline"
              className="w-full justify-start gap-3 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:text-white text-gray-300 transition-all h-11"
            >
              <ArrowLeftCircle className="w-5 h-5 text-[#F27124]" />
              <div className="flex flex-col items-start text-xs">
                <span className="font-semibold">Đổi lớp</span>
                <span className="text-[10px] text-gray-500 font-normal">
                  Quay lại danh sách
                </span>
              </div>
            </Button>
          )
        ) : (
          /* System Version Info for non-lecturers */
          !isCollapsed && (
            <div className="flex items-center gap-3 px-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-semibold text-gray-300">
                  System Stable
                </p>
                <p className="text-[10px] text-gray-500">v1.2.0 • Pro Plan</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
