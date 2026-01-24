// src/components/layouts/sidebar.tsx
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Import file đã tách
import { routeGroups, UserRole } from "./sidebar-config";
import { NavItem } from "./nav-item";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<UserRole>("STUDENT");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const role = Cookies.get("user_role") as UserRole;
    if (role) setCurrentRole(role);
  }, []);

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

      {/* HEADER LOGO */}
      <div
        className={cn(
          "flex items-center h-16 transition-all duration-300 border-b border-gray-800/50",
          isCollapsed ? "justify-center px-2" : "justify-between px-6",
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

      {/* USER ROLE BADGE */}
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
                className={cn(
                  "text-xs font-bold",
                  currentRole === "ADMIN"
                    ? "text-violet-400"
                    : currentRole === "LECTURER"
                      ? "text-emerald-400"
                      : "text-blue-400",
                )}
              >
                {currentRole}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MENU ITEMS */}
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
        {currentRole === "LECTURER" && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/lecturer/courses"
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
                  Quay lại danh sách lớp
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

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
