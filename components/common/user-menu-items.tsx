"use client";

import Link from "next/link";
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
  // Biến thể animation cho từng mục menu
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
        {/* HỒ SƠ CÁ NHÂN */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <DropdownMenuItem
            asChild
            className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 active:scale-95 border border-transparent hover:border-slate-100"
          >
            <Link href="/profile">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-[#F27124]/10 group-hover:text-[#F27124] transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold italic">
                  Hồ sơ cá nhân
                </span>
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          </DropdownMenuItem>
        </motion.div>

        {/* MENU ĐỘNG THEO ROLE */}
        {role === "STUDENT" && (
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <DropdownMenuItem
              asChild
              className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 active:scale-95 border border-transparent hover:border-slate-100"
            >
              <Link href="/student/my-score">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold italic">
                    Điểm số của tôi
                  </span>
                </div>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            </DropdownMenuItem>
          </motion.div>
        )}

        {role === "LECTURER" && (
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <DropdownMenuItem
              asChild
              className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 active:scale-95 border border-transparent hover:border-slate-100"
            >
              <Link href="/lecturer/courses">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold italic">
                    Lớp đang dạy
                  </span>
                </div>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            </DropdownMenuItem>
          </motion.div>
        )}

        {/* CÀI ĐẶT */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <DropdownMenuItem
            asChild
            className="group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 active:scale-95 border border-transparent hover:border-slate-100"
          >
            <Link href="/settings">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold italic">
                  Cài đặt tài khoản
                </span>
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          </DropdownMenuItem>
        </motion.div>
      </div>

      <DropdownMenuSeparator className="mx-2 bg-slate-100" />

      {/* NÚT ĐĂNG XUẤT  */}
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
            className="group flex items-center gap-3 p-3 rounded-2xl cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700 font-black relative overflow-hidden transition-all duration-300 active:scale-95"
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

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[reveal_1s_infinite] pointer-events-none" />
          </DropdownMenuItem>
        </motion.div>
      </div>
    </>
  );
}
