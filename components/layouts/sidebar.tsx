"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  Zap,
  ChevronLeft,
} from "lucide-react";
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
import { useActiveClassId } from "@/hooks/use-active-class-id";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { data: profile } = useProfile();
  const currentRole = (profile?.user?.role as UserRole) || "STUDENT";
  const activeClassId = useActiveClassId();

  const { data: classDetailData, isLoading: isClassLoading } = useClassDetails(activeClassId);

  const shouldFetchTeams = currentRole === "STUDENT" && !!activeClassId;
  const { data: teamsData } = useClassTeams(shouldFetchTeams ? activeClassId : undefined);

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
    if (!mounted || !classDetailData?.class) return null;

    const classInfo = classDetailData.class;

    if (currentRole === "LECTURER") {
      return {
        main: classInfo.name,
        sub: classInfo.subjectName || classInfo.subject_id?.name || "Giảng viên",
        type: "LECTURER" as const,
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
      return { main: classInfo.name, sub: teamName, type: "STUDENT" as const };
    }

    return null;
  }, [mounted, currentRole, classDetailData, teamsData, myTeamId]);

  const filteredRoutes = useMemo(
    () => routeGroups.filter((group) => group.roles.includes(currentRole)),
    [currentRole],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { x: -16, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.25 } },
  };

  if (!mounted) return <div className="w-full h-full bg-white dark:bg-slate-950" />;

  const logoHref =
    currentRole === "LECTURER"
      ? activeClassId ? `/dashboard?classId=${activeClassId}` : "/dashboard"
      : activeClassId ? `/student/dashboard?classId=${activeClassId}` : "/student/dashboard";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden font-sans"
    >
      {/* ── COLLAPSE HANDLE (tab cạnh phải) ── */}
      <div
        onClick={toggleSidebar}
        title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex",
          "flex-col items-center justify-center gap-1",
          "h-16 w-[18px] cursor-pointer select-none",
          "border-l border-slate-200 dark:border-slate-800",
          "bg-white dark:bg-slate-950",
          "hover:bg-slate-50 dark:hover:bg-slate-900",
          "transition-all duration-200 group/handle",
          "rounded-r-xl",
        )}
      >
        {/* 3 dots */}
        <div className="flex flex-col items-center gap-[3px]">
          <span className="w-[3px] h-[3px] rounded-full bg-slate-300 dark:bg-slate-600 group-hover/handle:bg-slate-500 dark:group-hover/handle:bg-slate-400 transition-colors" />
          <span className="w-[3px] h-[3px] rounded-full bg-slate-300 dark:bg-slate-600 group-hover/handle:bg-slate-500 dark:group-hover/handle:bg-slate-400 transition-colors" />
          <span className="w-[3px] h-[3px] rounded-full bg-slate-300 dark:bg-slate-600 group-hover/handle:bg-slate-500 dark:group-hover/handle:bg-slate-400 transition-colors" />
        </div>
        {/* Arrow hint on hover */}
        <ChevronLeft
          className={cn(
            "absolute w-2.5 h-2.5 text-slate-400 dark:text-slate-500",
            "opacity-0 group-hover/handle:opacity-100 transition-all duration-200",
            "group-hover/handle:text-slate-600 dark:group-hover/handle:text-slate-300",
            isCollapsed ? "rotate-180" : "rotate-0",
          )}
        />
      </div>

      {/* ── LOGO / BRANDING ── */}
      <div
        className={cn(
          "flex items-center h-16 shrink-0 border-b border-slate-200/80 dark:border-slate-800/80 px-4 transition-all duration-300",
          isCollapsed && "justify-center px-2",
        )}
      >
        <Link href={logoHref} className="flex items-center gap-3 group relative w-full min-w-0">
          <div className="relative shrink-0">
            <div className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300",
              "group-hover:scale-105 group-active:scale-95",
            )}>
              <Image
                src="/images/logo-icon.png"
                alt="GraphGrade Icon"
                width={60}
                height={60}
                className="w-9 h-9 object-contain"
              />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
              {isClassLoading && !classDisplayInfo ? (
                <div className="space-y-1.5">
                  <div className="h-2.5 w-20 bg-slate-800 rounded animate-pulse" />
                  <div className="h-2 w-14 bg-slate-800 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <span className="text-[12px] font-bold tracking-tight leading-none text-slate-900 dark:text-slate-100 truncate">
                    {classDisplayInfo ? classDisplayInfo.main : "SAG-CA"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-widest mt-1 truncate uppercase">
                    {classDisplayInfo ? classDisplayInfo.sub : "FPT Academic"}
                  </span>
                </>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* ── NAVIGATION ── */}
      <motion.nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-6 scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <motion.div key={index} variants={itemVariants} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 mb-2 flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
                    {group.label}
                  </span>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                </div>
              )}
              <div className="space-y-0.5">
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
      </motion.nav>

      {/* ── FOOTER ── */}
      <div className="shrink-0 p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        {/* Class switcher */}
        {classDisplayInfo && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={classDisplayInfo.type === "STUDENT" ? "/courses" : "/lecturer/courses"}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border",
                    "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800",
                    "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
                    "hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
                    "transition-all duration-200 group active:scale-95",
                    isCollapsed ? "justify-center h-10 w-full" : "px-3 py-2.5",
                  )}
                >
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                  {!isCollapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-none truncate">
                        Đổi lớp học
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-600 mt-0.5 truncate">
                        Chọn học phần khác
                      </span>
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-slate-900 border-slate-700 text-white text-xs font-bold">
                  Đổi lớp học
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

        {/* System status */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30"
          >
            <div className="flex items-center gap-2">
              <div className="relative h-1.5 w-1.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                <span className="relative block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Hệ thống
                </span>
                <span className="text-[8px] text-emerald-500/70 dark:text-emerald-600 font-medium mt-0.5">FPT Node v1.2.0</span>
              </div>
            </div>
            <Zap className="w-3 h-3 text-emerald-500/50 shrink-0" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
