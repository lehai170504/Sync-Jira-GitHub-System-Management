"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useLogout } from "@/features/auth/hooks/use-logout";

// Import Menu Items chung
import { UserMenuItems } from "../common/user-menu-items";

export function UserNav() {
  const queryClient = useQueryClient();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const user = profileData?.user;

  const handleLogout = () => {
    if (isLogoutPending) return;
    queryClient.removeQueries();
    logout();
  };

  const getRoleStyle = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "text-purple-600 bg-purple-50 border-purple-100";
      case "LECTURER":
        return "text-blue-600 bg-blue-50 border-blue-100";
      default:
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
    }
  };

  if (isProfileLoading) {
    return (
      <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse border border-slate-200" />
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-offset-2 hover:ring-2 hover:ring-slate-200 transition-all p-0"
        >
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage
              src={user.avatar_url}
              alt={user.full_name}
              className="object-cover"
            />
            <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-600">
              {user.full_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 mt-2 p-1 shadow-xl border-slate-200"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-3 bg-slate-50/50 rounded-t-md mb-1">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900 truncate max-w-[160px]">
                {user.full_name}
              </p>
              {user.is_verified && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-current" />
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <div className="pt-1">
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getRoleStyle(user.role)}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-1" />

        {/* 👇 GỌI LẠI MENU ITEMS CHUNG */}
        <UserMenuItems
          role={user.role}
          isLogoutPending={isLogoutPending}
          onLogout={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
