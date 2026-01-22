"use client";

import { useEffect, useState } from "react";
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
  CreditCard,
  BadgeCheck,
  BookOpen,
  Shield,
  Loader2, // Import Loader
} from "lucide-react";

// Import Type Role chung
import { UserRole } from "./sidebar-config";
// Import Hook Logout mới tạo
import { useLogout } from "@/features/auth/hooks/use-logout";

interface UserInfo {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export function UserNav() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  // Gọi hook logout
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    const role = Cookies.get("user_role") as UserRole;
    const name = Cookies.get("user_name");
    const email = Cookies.get("user_email");
    const avatar = Cookies.get("user_avatar");

    if (role && name && email) {
      setUser({ role, name, email, avatar });
    }
    setMounted(true);
  }, []);

  const handleLogout = () => {
    if (isPending) return;
    logout();
  };

  if (!mounted)
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />;

  if (!user) return null;

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "text-purple-600";
      case "LECTURER":
        return "text-emerald-600";
      default:
        return "text-blue-600";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all p-0"
        >
          <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback
              className={`bg-primary/5 font-bold ${getRoleColor(user.role)}`}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4 bg-muted/30">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold leading-none text-foreground truncate max-w-[180px]">
                {user.name}
              </p>
              <BadgeCheck
                className={`w-4 h-4 ${getRoleColor(user.role)}`}
                fill="currentColor"
                color="white"
              />
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
            <div className="pt-1">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${getRoleColor(user.role)}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem className="cursor-pointer py-2.5">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Hồ sơ cá nhân</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          {user.role === "STUDENT" && (
            <Link href="/student/my-score" passHref>
              <DropdownMenuItem className="cursor-pointer py-2.5">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Điểm số của tôi</span>
              </DropdownMenuItem>
            </Link>
          )}

          {user.role === "LECTURER" && (
            <Link href="/lecturer/class-management" passHref>
              <DropdownMenuItem className="cursor-pointer py-2.5">
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Lớp đang dạy</span>
              </DropdownMenuItem>
            </Link>
          )}

          {user.role === "ADMIN" && (
            <Link href="/dashboard" passHref>
              <DropdownMenuItem className="cursor-pointer py-2.5">
                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Trang quản trị</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* LOGOUT BUTTON */}
        <DropdownMenuItem
          className="cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 font-medium"
          onClick={handleLogout}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isPending ? "Đang xử lý..." : "Đăng xuất"}</span>
          {!isPending && <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
