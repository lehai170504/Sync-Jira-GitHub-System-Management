"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  UserCircle,
  ArrowLeft,
  BookOpen,
  Crown,
  LayoutDashboard,
  Zap,
  MonitorCheck,
  Badge,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { routeGroups, UserRole } from "./sidebar-config";
import { NavItem } from "./nav-item";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { data: profile } = useProfile();
  const currentRole = (profile?.user?.role as UserRole) || "STUDENT";
  const studentClassId = Cookies.get("student_class_id");

  const shouldFetchTeams = currentRole === "STUDENT" && !!studentClassId;
  const { data: teamsData } = useClassTeams(
    shouldFetchTeams ? studentClassId : undefined,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const classDisplayInfo = useMemo(() => {
    if (!mounted) return null;

    if (currentRole === "LECTURER") {
      const name = Cookies.get("lecturer_class_name");
      const sub = Cookies.get("lecturer_subject");
      return name
        ? { main: name, sub: sub || "Giảng viên", type: "LECTURER" }
        : null;
    }

    if (currentRole === "STUDENT") {
      const name = Cookies.get("student_class_name");
      const teamCookie = Cookies.get("student_team_name");
      const isLeader = Cookies.get("student_is_leader") === "true";

      let teamName = teamCookie || "Chưa có nhóm";
      if (teamsData?.teams && teamCookie) {
        const myTeam = teamsData.teams.find(
          (t: any) => t.project_name === teamCookie,
        );
        if (myTeam) teamName = myTeam.project_name;
      }
      return name
        ? { main: name, sub: teamName, type: "STUDENT", isLeader }
        : null;
    }
    return null;
  }, [mounted, currentRole, teamsData]);

  const filteredRoutes = useMemo(
    () => routeGroups.filter((group) => group.roles.includes(currentRole)),
    [currentRole],
  );

  if (!mounted) return <div className="w-full h-full bg-[#0B0F1A]" />;

  return (
    <div className="flex flex-col h-full bg-[#0B0F1A] text-slate-300 border-r border-slate-800/40 relative overflow-hidden transition-all duration-300 shadow-2xl">
      {/* 1. TOGGLE BUTTON - Glassmorphism style */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full",

          "bg-white border border-slate-200 text-[#F27124] shadow-md z-[100]",
          "hover:bg-orange-50 hover:scale-110 active:scale-95 transition-all duration-300",
          "hidden md:flex items-center justify-center",
        )}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </Button>

      {/* 2. HEADER: LOGO & BRANDING */}
      <div
        className={cn(
          "flex items-center h-20 shrink-0 transition-all duration-300 border-b border-slate-800/50 bg-[#0B0F1A]/80 backdrop-blur-md px-6",
          isCollapsed && "px-2 justify-center",
        )}
      >
        <Link
          href={
            currentRole === "LECTURER" ? "/dashboard" : "/student/dashboard"
          }
          className="flex items-center gap-3.5 group"
        >
          <div
            className={cn(
              "relative w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-12 group-active:scale-90",
              classDisplayInfo?.type === "STUDENT"
                ? "bg-gradient-to-br from-[#F27124] to-[#ff8c42] shadow-[0_0_20px_rgba(242,113,36,0.3)]"
                : "bg-gradient-to-br from-blue-600 to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]",
              !classDisplayInfo && "bg-slate-700",
            )}
          >
            {classDisplayInfo ? (
              <BookOpen className="w-5 h-5 text-white" />
            ) : (
              <LayoutDashboard className="w-5 h-5 text-white" />
            )}
          </div>

          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2">
              <h1 className="text-sm font-black tracking-tight leading-none text-white truncate uppercase">
                {classDisplayInfo ? classDisplayInfo.main : "SyncSystem"}
              </h1>
              <span className="text-[10px] text-[#F27124] font-black uppercase tracking-widest mt-1.5 truncate">
                {classDisplayInfo ? classDisplayInfo.sub : "FPT Academic"}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 3. USER CONTEXT BLOCK - Bento style */}
      {!isCollapsed && (
        <div className="px-4 py-6 shrink-0">
          <div className="p-4 rounded-[24px] bg-[#161B2A]/50 border border-slate-800/60 relative overflow-hidden group hover:border-[#F27124]/30 transition-colors">
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-[#F27124]/10 transition-colors">
                <UserCircle className="w-5 h-5 text-slate-400 group-hover:text-[#F27124]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] leading-none mb-1.5">
                  Nhận diện
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[11px] font-black uppercase tracking-tight",
                      currentRole === "ADMIN"
                        ? "text-violet-400"
                        : currentRole === "LECTURER"
                          ? "text-blue-400"
                          : "text-[#F27124]",
                    )}
                  >
                    {currentRole}
                  </span>
                  {classDisplayInfo?.isLeader && (
                    <Badge className="bg-[#F27124] text-white hover:bg-[#F27124] border-none text-[8px] font-black uppercase h-4 px-1.5 tracking-tighter animate-pulse shadow-[0_0_10px_rgba(242,113,36,0.4)]">
                      <Crown className="w-2 h-2 mr-1 fill-white" /> Nhóm trưởng
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {/* Background pattern decoration */}
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <MonitorCheck className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* 4. NAVIGATION LIST - Optimized Scrollbar */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2 px-3 space-y-8">
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <div
              key={index}
              className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {!isCollapsed && (
                <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
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

      {/* 5. FOOTER: CLASS SWITCHER & SYSTEM STATUS */}
      <div className="shrink-0 p-4 mt-auto border-t border-slate-800/80 bg-[#0B0F1A] z-20 space-y-4">
        {classDisplayInfo && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={
                    classDisplayInfo.type === "STUDENT"
                      ? "/courses"
                      : "/lecturer/courses"
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-[#161B2A] border border-slate-800/60 text-slate-300 hover:border-[#F27124]/40 hover:text-white transition-all group overflow-hidden relative active:scale-95",
                    isCollapsed
                      ? "justify-center h-12 w-full"
                      : "px-4 py-3.5 shadow-lg",
                  )}
                >
                  <ArrowLeft className="w-4 h-4 text-[#F27124] group-hover:-translate-x-1 transition-transform" />
                  {!isCollapsed && (
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-white leading-none">
                        Đổi lớp học
                      </span>
                      <span className="text-[9px] text-slate-500 mt-1 font-bold uppercase tracking-wider">
                        Chọn học phần khác
                      </span>
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="font-bold bg-[#F27124] border-none text-white shadow-xl"
                >
                  Đổi lớp học
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

        {!isCollapsed && (
          <div className="p-3.5 rounded-2xl bg-[#F27124]/5 border border-[#F27124]/10 group cursor-default">
            <div className="flex items-center gap-3">
              <div className="relative h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                <span className="relative block h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter group-hover:text-[#F27124] transition-colors">
                  Phiên bản hệ thống
                </p>
                <p className="text-[8px] text-slate-600 font-bold">
                  FPT_NODE_V1.2.0
                </p>
              </div>
              <Zap className="w-3 h-3 text-[#F27124] ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
