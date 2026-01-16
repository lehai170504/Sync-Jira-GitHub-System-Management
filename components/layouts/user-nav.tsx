"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

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
  Settings,
  CreditCard,
  BadgeCheck,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

// Định nghĩa thông tin User giả lập theo Role
const USER_INFO_MAP = {
  ADMIN: {
    name: "System Admin",
    email: "admin@fpt.edu.vn",
    avatar: "https://github.com/shadcn.png",
    fallback: "AD",
    color: "text-purple-600",
  },
  LECTURER: {
    name: "Trần Văn Hiến",
    email: "hientv@fpt.edu.vn",
    avatar: "", // Không có ảnh để test fallback
    fallback: "GV",
    color: "text-blue-600",
  },
  LEADER: {
    name: "Nguyễn Văn A (Leader)",
    email: "annv@fpt.edu.vn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    fallback: "LD",
    color: "text-orange-600",
  },
  MEMBER: {
    name: "Trần Thị Bình",
    email: "binhtt@fpt.edu.vn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    fallback: "SV",
    color: "text-green-600",
  },
};

export function UserNav() {
  const router = useRouter();
  const [role, setRole] = useState<keyof typeof USER_INFO_MAP>("MEMBER");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Lấy role từ cookie khi client load xong
    const savedRole = Cookies.get("user_role") as keyof typeof USER_INFO_MAP;
    if (savedRole && USER_INFO_MAP[savedRole]) {
      setRole(savedRole);
    }
    setMounted(true);
  }, []);

  // Lấy thông tin user hiện tại
  const currentUser = USER_INFO_MAP[role] || USER_INFO_MAP.MEMBER;

  // Hàm đăng xuất
  const handleLogout = () => {
    Cookies.remove("user_role"); // Xóa cookie role
    router.push("/login"); // Quay về trang login
  };

  if (!mounted) return null; // Tránh hydration error

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback
              className={`bg-primary/10 font-bold ${currentUser.color}`}
            >
              {currentUser.fallback}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* USER INFO HEADER */}
        <DropdownMenuLabel className="font-normal p-4 bg-muted/30">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold leading-none text-foreground truncate max-w-[150px]">
                {currentUser.name}
              </p>
              {/* Icon tích xanh cho uy tín */}
              <BadgeCheck
                className={`w-4 h-4 ${currentUser.color}`}
                fill="currentColor"
                color="white"
              />
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* AI CŨNG CÓ: Hồ sơ cá nhân */}
          <Link href="/profile" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Hồ sơ cá nhân</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          {/* CHỈ SINH VIÊN (Leader/Member): Xem điểm */}
          {(role === "MEMBER" || role === "LEADER") && (
            <Link href="/my-score" passHref>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Điểm số của tôi</span>
              </DropdownMenuItem>
            </Link>
          )}

          {/* CHỈ GIẢNG VIÊN: Lớp học */}
          {role === "LECTURER" && (
            <Link href="/lecturer/classes" passHref>
              <DropdownMenuItem className="cursor-pointer">
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Lớp đang dạy</span>
              </DropdownMenuItem>
            </Link>
          )}

          {/* CHỈ ADMIN & LEADER: Vào Dashboard quản lý */}
          {(role === "ADMIN" || role === "LEADER") && (
            <Link href="/dashboard" passHref>
              <DropdownMenuItem className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Quản lý dự án</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* CHỈ ADMIN: Cài đặt hệ thống */}
        {role === "ADMIN" && (
          <>
            <Link href="/settings" passHref>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Cài đặt hệ thống</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}

        {/* LOGOUT BUTTON */}
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
