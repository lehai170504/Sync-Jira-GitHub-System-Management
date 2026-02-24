"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  Zap,
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
import { motion } from "framer-motion";

import { routeGroups, UserRole } from "./sidebar-config";
import { NavItem } from "./nav-item";

import { useProfile } from "@/features/auth/hooks/use-profile";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // --- DATA FETCHING ---
  const { data: profile } = useProfile();
  const currentRole = (profile?.user?.role as UserRole) || "STUDENT";
  const urlClassId = searchParams.get("classId");
  const studentCookieId = Cookies.get("student_class_id");
  const lecturerCookieId = Cookies.get("lecturer_class_id");
  const fallbackCookieId =
    currentRole === "LECTURER" ? lecturerCookieId : studentCookieId;
  const activeClassId = urlClassId || fallbackCookieId;

  const { data: classDetailData, isLoading: isClassLoading } =
    useClassDetails(activeClassId);

  const shouldFetchTeams = currentRole === "STUDENT" && !!activeClassId;
  const { data: teamsData } = useClassTeams(
    shouldFetchTeams ? activeClassId : undefined,
  );

  const myTeamId = useMemo(() => {
    if (!teamsData?.teams || !profile?.user?._id) return undefined;
    const team = teamsData.teams.find((t: any) =>
      t.members?.some((m: any) => m._id === profile?.user?._id),
    );
    return team?._id;
  }, [teamsData, profile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const classDisplayInfo = useMemo(() => {
    if (!mounted) return null;
    if (!classDetailData?.class) return null;

    const classInfo = classDetailData.class;

    if (currentRole === "LECTURER") {
      return {
        main: classInfo.name,
        sub:
          classInfo.subjectName || classInfo.subject_id?.name || "Giảng viên",
        type: "LECTURER",
      };
    }

    if (currentRole === "STUDENT") {
      let teamName = "Chưa có nhóm";

      if (teamsData?.teams && myTeamId) {
        const team = teamsData.teams.find((t: any) => t._id === myTeamId);
        if (team) teamName = team.project_name;
      } else {
        const cookieTeam = Cookies.get("student_team_name");
        if (cookieTeam) teamName = cookieTeam;
      }

      return {
        main: classInfo.name,
        sub: teamName,
        type: "STUDENT",
      };
    }

    return null;
  }, [mounted, currentRole, classDetailData, teamsData, myTeamId]);

  const filteredRoutes = useMemo(
    () => routeGroups.filter((group) => group.roles.includes(currentRole)),
    [currentRole],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  if (!mounted)
    return (
      <div className="w-full h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800" />
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-all duration-300 font-sans"
    >
      {/* 1. TOGGLE BUTTON */}
      <Button
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full",
          "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-md z-100",
          "hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 hover:scale-110 active:scale-95 transition-all duration-300",
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
          "flex items-center h-20 shrink-0 transition-all duration-300 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md px-6",
          isCollapsed && "px-2 justify-center",
        )}
      >
        <Link
          href={
            currentRole === "LECTURER"
              ? activeClassId
                ? `/dashboard?classId=${activeClassId}`
                : "/dashboard"
              : activeClassId
                ? `/student/dashboard?classId=${activeClassId}`
                : "/student/dashboard"
          }
          className="flex items-center gap-3.5 group relative w-full"
        >
          {/* Logo Container */}
          <div className="relative shrink-0">
            {!isCollapsed && (
              <div className="absolute -inset-3 border border-dashed border-slate-300 dark:border-slate-700/50 rounded-full animate-orbit-slow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
            <div
              className={cn(
                "relative w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-6 group-active:scale-90 shadow-sm",
                classDisplayInfo?.type === "STUDENT"
                  ? "bg-blue-600 dark:bg-blue-600 shadow-blue-500/20"
                  : "bg-emerald-600 dark:bg-emerald-600 shadow-emerald-500/20",
                !classDisplayInfo && "bg-slate-800 dark:bg-slate-700",
              )}
            >
              {classDisplayInfo ? (
                <BookOpen className="w-5 h-5 text-white" />
              ) : (
                <LayoutDashboard className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          {/* Text Container */}
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 w-full">
              {isClassLoading && !classDisplayInfo ? (
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-sm font-black tracking-tight leading-none text-slate-900 dark:text-slate-100 truncate uppercase">
                    {classDisplayInfo ? classDisplayInfo.main : "SyncSystem"}
                  </h1>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest mt-1.5 truncate uppercase">
                    {classDisplayInfo ? classDisplayInfo.sub : "FPT Academic"}
                  </span>
                </>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* 3. NAVIGATION LIST */}
      <motion.div
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6 px-3 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="space-y-3"
            >
              {!isCollapsed && (
                <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-3">
                  {group.label}
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    pathname={pathname}
                    currentClassId={activeClassId}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </TooltipProvider>
      </motion.div>

      {/* 4. FOOTER: CLASS SWITCHER */}
      <div className="shrink-0 p-4 mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 z-20 space-y-4">
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
                    "flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all group overflow-hidden relative active:scale-95 duration-300",
                    isCollapsed
                      ? "justify-center h-12 w-full"
                      : "px-4 py-3 shadow-sm",
                  )}
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-x-1 transition-transform relative z-10 shrink-0" />
                  {!isCollapsed && (
                    <div className="flex flex-col text-left relative z-10 w-full overflow-hidden">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors truncate">
                        Đổi lớp học
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-wide truncate">
                        Chọn học phần khác
                      </span>
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="font-bold bg-slate-900 dark:bg-slate-800 border-none text-white shadow-xl"
                >
                  Đổi lớp học
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

        {/* System Status Block */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 cursor-default transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-2 w-2 shrink-0">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                <span className="relative block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter truncate">
                  Trạng thái hệ thống
                </p>
                <p className="text-[9px] text-emerald-600/70 dark:text-emerald-500/70 font-semibold tracking-widest mt-0.5 truncate">
                  FPT Node v1.2.0
                </p>
              </div>
            </div>
            <Zap className="w-3 h-3 text-emerald-500 opacity-60 shrink-0" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
