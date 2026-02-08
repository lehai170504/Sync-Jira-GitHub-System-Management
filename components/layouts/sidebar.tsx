"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"; // 1. Import useSearchParams
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
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIG & TYPES ---
import { routeGroups, UserRole } from "./sidebar-config";
import { NavItem } from "./nav-item";

// --- HOOKS ---
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useClassTeams } from "@/features/student/hooks/use-class-teams";
import { useClassDetails } from "@/features/management/classes/hooks/use-class-details";
import { useMyTeamRole } from "@/features/student/hooks/use-my-team-role";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 2. Lấy query params
  const [mounted, setMounted] = useState(false);

  // ----------------------------------------------------------------------
  // 1. DATA FETCHING LAYER
  // ----------------------------------------------------------------------

  // A. Thông tin User
  const { data: profile } = useProfile();
  const currentRole = (profile?.user?.role as UserRole) || "STUDENT";

  // B. Xác định Context Lớp học (Hybrid Strategy)
  // Ưu tiên 1: Lấy từ URL (?classId=...)
  const urlClassId = searchParams.get("classId");

  // Ưu tiên 2: Lấy từ Cookie (Backup nếu F5 hoặc vào trực tiếp)
  const studentCookieId = Cookies.get("student_class_id");
  const lecturerCookieId = Cookies.get("lecturer_class_id");
  const fallbackCookieId =
    currentRole === "LECTURER" ? lecturerCookieId : studentCookieId;

  // ID chốt hạ để gọi API
  const activeClassId = urlClassId || fallbackCookieId;

  // C. API 1: Lấy chi tiết lớp
  const { data: classDetailData, isLoading: isClassLoading } =
    useClassDetails(activeClassId);

  // D. API 2: Lấy danh sách Teams
  const shouldFetchTeams = currentRole === "STUDENT" && !!activeClassId;
  const { data: teamsData } = useClassTeams(
    shouldFetchTeams ? activeClassId : undefined,
  );

  // E. Derived State: Tìm ID Team
  const myTeamId = useMemo(() => {
    if (!teamsData?.teams || !profile?.user?._id) return undefined;
    const team = teamsData.teams.find((t: any) =>
      t.members?.some((m: any) => m._id === profile?.user?._id),
    );
    return team?._id;
  }, [teamsData, profile]);

  // F. API 3: Check Role
  const { data: roleData } = useMyTeamRole(myTeamId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ----------------------------------------------------------------------
  // 2. DISPLAY LOGIC LAYER
  // ----------------------------------------------------------------------

  const classDisplayInfo = useMemo(() => {
    if (!mounted) return null;
    if (!classDetailData?.class) return null;

    const classInfo = classDetailData.class;

    // CASE 1: LECTURER
    if (currentRole === "LECTURER") {
      return {
        main: classInfo.name,
        sub:
          classInfo.subjectName || classInfo.subject_id?.name || "Giảng viên",
        type: "LECTURER",
      };
    }

    // CASE 2: STUDENT
    if (currentRole === "STUDENT") {
      let teamName = "Chưa có nhóm";
      let isLeader = false;

      // Logic Team Name
      if (teamsData?.teams && myTeamId) {
        const team = teamsData.teams.find((t: any) => t._id === myTeamId);
        if (team) teamName = team.project_name;
      } else {
        const cookieTeam = Cookies.get("student_team_name");
        if (cookieTeam) teamName = cookieTeam;
      }

      // Logic Leader
      if (roleData) {
        isLeader = roleData.is_leader;
      } else {
        isLeader = Cookies.get("student_is_leader") === "true";
      }

      return {
        main: classInfo.name,
        sub: teamName,
        type: "STUDENT",
        isLeader,
      };
    }

    return null;
  }, [mounted, currentRole, classDetailData, teamsData, myTeamId, roleData]);

  const filteredRoutes = useMemo(
    () => routeGroups.filter((group) => group.roles.includes(currentRole)),
    [currentRole],
  );

  // Animation Variants (Giữ nguyên)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  if (!mounted) return <div className="w-full h-full bg-[#0B0F1A]" />;

  // ----------------------------------------------------------------------
  // 3. RENDER UI LAYER
  // ----------------------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-[#0B0F1A] text-slate-300 border-r border-slate-800/40 relative overflow-hidden transition-all duration-300 shadow-2xl font-mono"
    >
      {/* 1. TOGGLE BUTTON (Giữ nguyên) */}
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

      {/* 2. HEADER: LOGO & BRANDING (Giữ nguyên) */}
      <div
        className={cn(
          "flex items-center h-20 shrink-0 transition-all duration-300 border-b border-slate-800/50 bg-[#0B0F1A]/80 backdrop-blur-md px-6",
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
          className="flex items-center gap-3.5 group relative"
        >
          {/* Logo Container (Giữ nguyên) */}
          <div className="relative">
            {!isCollapsed && (
              <div className="absolute -inset-3 border border-dashed border-slate-700/50 rounded-full animate-orbit-slow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
            <div
              className={cn(
                "relative w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-6 group-active:scale-90",
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
          </div>

          {/* Text Container (Giữ nguyên) */}
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2">
              {isClassLoading && !classDisplayInfo ? (
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-slate-800 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-sm font-black tracking-tight leading-none text-white truncate uppercase italic">
                    {classDisplayInfo ? classDisplayInfo.main : "SyncSystem"}
                  </h1>
                  <span className="text-[10px] text-[#F27124] font-bold tracking-widest mt-1.5 truncate">
                    {classDisplayInfo ? classDisplayInfo.sub : "FPT Academic"}
                  </span>
                </>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* 3. USER CONTEXT BLOCK (Giữ nguyên) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-6 shrink-0"
          >
            {/* ... Block User Info (Giữ nguyên code cũ) ... */}
            <div className="p-4 rounded-[24px] bg-[#161B2A]/50 border border-slate-800/60 relative overflow-hidden group hover:border-[#F27124]/30 transition-all duration-500 hover:shadow-lg hover:shadow-orange-900/10 hover:-translate-y-1">
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-[#F27124]/10 transition-colors duration-300">
                  <UserCircle className="w-5 h-5 text-slate-400 group-hover:text-[#F27124]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-black tracking-[0.2em] leading-none mb-1.5 uppercase">
                    Nhận diện
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-bold capitalize tracking-tight",
                        currentRole === "ADMIN"
                          ? "text-violet-400"
                          : currentRole === "LECTURER"
                            ? "text-blue-400"
                            : "text-[#F27124]",
                      )}
                    >
                      {currentRole.toLowerCase()}
                    </span>
                    {classDisplayInfo?.isLeader && (
                      <Badge className="bg-[#F27124] text-white border-none text-[8px] font-black uppercase h-4 px-1.5 animate-pulse">
                        <Crown className="w-2 h-2 mr-1 fill-white" /> Leader
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <MonitorCheck className="w-20 h-20 text-white" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. NAVIGATION LIST (CẬP NHẬT: Truyền classId vào NavItem) */}
      <motion.div
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2 px-3 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TooltipProvider delayDuration={0}>
          {filteredRoutes.map((group, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="space-y-2"
            >
              {!isCollapsed && (
                <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                  {group.label}
                  <div className="h-px bg-slate-800 flex-1" />
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

      {/* 5. FOOTER: CLASS SWITCHER (Giữ nguyên - Link đổi lớp không cần param) */}
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
                    "flex items-center gap-3 rounded-2xl bg-[#161B2A] border border-slate-800/60 text-slate-300 hover:border-[#F27124]/40 hover:text-white transition-all group overflow-hidden relative active:scale-95 duration-300",
                    isCollapsed
                      ? "justify-center h-12 w-full"
                      : "px-4 py-3.5 shadow-lg",
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F27124]/0 via-[#F27124]/5 to-[#F27124]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <ArrowLeft className="w-4 h-4 text-[#F27124] group-hover:-translate-x-1 transition-transform relative z-10" />
                  {!isCollapsed && (
                    <div className="flex flex-col text-left relative z-10">
                      <span className="text-xs font-black text-white leading-none">
                        Đổi lớp học
                      </span>
                      <span className="text-[9px] text-slate-500 mt-1 font-bold tracking-wider">
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

        {/* System Status Block (Giữ nguyên) */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-3.5 rounded-2xl bg-[#F27124]/5 border border-[#F27124]/10 group cursor-default hover:bg-[#F27124]/10 transition-colors"
          >
            {/* ... Block Status ... */}
            <div className="flex items-center gap-3">
              <div className="relative h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                <span className="relative block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter group-hover:text-[#F27124] transition-colors">
                  Trạng thái hệ thống
                </p>
                <p className="text-[8px] text-slate-500 font-bold tracking-widest mt-0.5">
                  FPT Node v1.2.0
                </p>
              </div>
              <Zap className="w-3 h-3 text-[#F27124] ml-auto opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
