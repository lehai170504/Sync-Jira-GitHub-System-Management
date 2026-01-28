"use client";

import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  Loader2,
  CreditCard,
  BookOpen,
  Shield,
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
  return (
    <>
      <div className="p-1 space-y-1">
        <DropdownMenuItem
          asChild
          className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
        >
          <Link href="/profile">
            <User className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-semibold">Hồ sơ cá nhân</span>
          </Link>
        </DropdownMenuItem>

        {/* Menu động theo Role */}
        {role === "STUDENT" && (
          <DropdownMenuItem
            asChild
            className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
          >
            <Link href="/student/my-score">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-semibold">Điểm số của tôi</span>
            </Link>
          </DropdownMenuItem>
        )}

        {role === "LECTURER" && (
          <DropdownMenuItem
            asChild
            className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
          >
            <Link href="/lecturer/courses">
              <BookOpen className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-semibold">Lớp đang dạy</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          asChild
          className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
        >
          <Link href="/settings">
            <Settings className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-semibold">Cài đặt tài khoản</span>
          </Link>
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator className="mx-2 bg-slate-100" />

      <div className="p-1">
        <DropdownMenuItem
          disabled={isLogoutPending}
          onClick={onLogout}
          className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700 font-bold"
        >
          {isLogoutPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
          <span className="text-sm">
            {isLogoutPending ? "Đang xử lý..." : "Đăng xuất"}
          </span>
        </DropdownMenuItem>
      </div>
    </>
  );
}
