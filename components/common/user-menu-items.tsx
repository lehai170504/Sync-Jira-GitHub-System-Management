"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  Loader2,
  CreditCard,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { ProfileDialog } from "@/features/auth/components/profile/profile-dialog";
import { SettingsDialog } from "@/features/settings/settings-dialog";

interface UserMenuItemsProps {
  role?: string;
  isLogoutPending: boolean;
  onLogout: () => void;
}

export function UserMenuItems({
  role,
  isLogoutPending,
  onLogout,
}: UserMenuItemsProps) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  const handleDelayedLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setTimeout(() => {
      onLogout();
    }, 400);
  };

  return (
    <>
      <div className="p-1.5 space-y-1 font-mono">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <DropdownMenuItem
            className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none active:scale-95 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            onClick={(e) => {
              e.preventDefault();
              setIsProfileOpen(true);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-[#F27124]/10 dark:group-hover:bg-[#F27124]/20 group-hover:text-[#F27124] dark:group-hover:text-orange-400 transition-colors">
                <User className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-[#F27124] dark:group-hover:text-orange-400 transition-colors" />
              </div>
              <span className="text-[11px] font-bold italic text-slate-700 dark:text-slate-200 group-hover:text-[#F27124] dark:group-hover:text-orange-400 transition-colors">
                Hồ sơ cá nhân
              </span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-slate-400 dark:text-slate-500 group-hover:text-[#F27124] dark:group-hover:text-orange-400" />
          </DropdownMenuItem>
        </motion.div>

        {role === "STUDENT" && pathname !== "/student/my-score" && (
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <DropdownMenuItem
              asChild
              className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none active:scale-95 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              <Link href="/student/my-score">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold italic text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Điểm số của tôi
                  </span>
                </div>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </Link>
            </DropdownMenuItem>
          </motion.div>
        )}

        {role === "LECTURER" && pathname !== "/lecturer/courses" && (
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <DropdownMenuItem
              asChild
              className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none active:scale-95 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              <Link href="/lecturer/courses">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <BookOpen className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold italic text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Lớp đang dạy
                  </span>
                </div>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
              </Link>
            </DropdownMenuItem>
          </motion.div>
        )}

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <DropdownMenuItem
            className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none active:scale-95 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            onClick={(e) => {
              e.preventDefault();
              setIsSettingsOpen(true);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-slate-100 group-hover:text-white dark:group-hover:text-slate-900 transition-colors">
                <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-slate-900 transition-colors" />
              </div>
              <span className="text-[11px] font-bold italic text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Cài đặt hệ thống
              </span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white" />
          </DropdownMenuItem>
        </motion.div>
      </div>

      <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800" />

      <div className="p-1.5 font-mono">
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <DropdownMenuItem
            disabled={isLogoutPending}
            onClick={handleDelayedLogout}
            className="group flex items-center gap-3 p-3 rounded-2xl cursor-pointer text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-900/20 focus:text-rose-700 dark:focus:text-rose-300 font-black relative overflow-hidden transition-all duration-300 active:scale-95"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              {isLogoutPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <motion.div
                  whileTap={{ x: 80, opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 150, damping: 10 }}
                >
                  <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              )}
            </div>

            <span className="text-[11px] font-bold tracking-widest">
              {isLogoutPending ? "Đang xử lý..." : "Đăng xuất"}
            </span>

            <div className="absolute inset-0 bg-linear-to-r from-transparent via-rose-500/10 dark:via-rose-500/20 to-transparent -translate-x-full group-hover:animate-[reveal_1s_infinite] pointer-events-none" />
          </DropdownMenuItem>
        </motion.div>
      </div>

      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        userRole={role}
      />
    </>
  );
}
