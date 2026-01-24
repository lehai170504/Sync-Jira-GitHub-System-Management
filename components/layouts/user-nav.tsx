"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User,
  CreditCard,
  BadgeCheck,
  BookOpen,
  Shield,
  Loader2,
  Settings,
} from "lucide-react";
// 👇 1. Import useQueryClient
import { useQueryClient } from "@tanstack/react-query";

import { useProfile } from "@/features/auth/hooks/use-profile";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function UserNav() {
  // 1. Hook Query Client
  const queryClient = useQueryClient();

  // 2. Lấy thông tin user
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const user = profileData?.user;

  // 3. Hook logout
  const { mutate: logout, isPending: isLogoutPending } = useLogout();

  // 👇 4. Xử lý Logout: Xóa Cache ngay lập tức
  const handleLogout = () => {
    if (isLogoutPending) return;

    // Quan trọng: Xóa toàn bộ cache user cũ để tránh hiển thị nhầm khi login user mới
    queryClient.removeQueries();
    // Hoặc cụ thể hơn: queryClient.removeQueries({ queryKey: ["user-profile"] });

    logout();
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "LECTURER":
        return "text-blue-600 bg-blue-50 border-blue-200"; // Đổi màu cho Lecturer
      case "STUDENT":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  if (isProfileLoading) {
    return (
      <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-slate-200 transition-all p-0"
        >
          <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
            <AvatarImage
              src={user.avatar_url}
              alt={user.full_name}
              className="object-cover"
            />
            <AvatarFallback className="font-bold text-slate-500 bg-slate-100">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-1" align="end" forceMount>
        {/* Header Info */}
        <DropdownMenuLabel className="font-normal p-3 bg-slate-50/50 mb-1 rounded-t-sm">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold leading-none text-slate-900 truncate max-w-[150px]">
                {user.full_name}
              </p>
              {user.is_verified && (
                <BadgeCheck
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  color="white"
                />
              )}
            </div>
            <p className="text-xs leading-none text-slate-500 truncate">
              {user.email}
            </p>
            <div className="pt-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleColor(user.role)}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-slate-500" />
              <span>Hồ sơ cá nhân</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          {/* MENU RIÊNG CHO TỪNG ROLE */}

          {/* 1. STUDENT */}
          {user.role === "STUDENT" && (
            <Link href="/student/my-score" passHref>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4 text-slate-500" />
                <span>Điểm số của tôi</span>
              </DropdownMenuItem>
            </Link>
          )}

          {/* 2. LECTURER */}
          {user.role === "LECTURER" && (
            <Link href="/lecturer/class-management" passHref>
              <DropdownMenuItem className="cursor-pointer">
                <BookOpen className="mr-2 h-4 w-4 text-slate-500" />
                <span>Lớp đang dạy</span>
              </DropdownMenuItem>
            </Link>
          )}

          {/* 3. ADMIN */}
          {user.role === "ADMIN" && (
            <>
              <Link href="/dashboard" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Dashboard Quản trị</span>
                </DropdownMenuItem>
              </Link>
              {/* Thêm link config cho Admin/Leader nếu cần */}
              <Link href="/dashboard/config" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Cấu hình hệ thống</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
          disabled={isLogoutPending}
        >
          {isLogoutPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isLogoutPending ? "Đang đăng xuất..." : "Đăng xuất"}</span>
          {!isLogoutPending && <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
