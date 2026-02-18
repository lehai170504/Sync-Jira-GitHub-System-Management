"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, Sparkles } from "lucide-react";
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
    queryClient.clear();
    logout();
  };

  const getRoleStyle = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-50 text-purple-600 border-purple-100 shadow-purple-500/20 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
      case "LECTURER":
        return "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/20 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
    }
  };

  // Safe Name Handling
  const displayName = useMemo(() => user?.full_name || "Unknown User", [user]);
  const displayEmail = useMemo(() => user?.email || "No Email", [user]);
  const userInitial = useMemo(
    () => displayName.charAt(0).toUpperCase(),
    [displayName],
  );

  // --- 1. LOADING STATE: SKELETON
  if (isProfileLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse border-2 border-white dark:border-slate-700 shadow-sm" />
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative focus:outline-none [perspective:1000px]">
          <div className="relative rounded-full p-0.5 transition-all duration-500 group-hover:bg-gradient-to-tr group-hover:from-[#F27124] group-hover:to-orange-300 group-hover:shadow-lg group-hover:shadow-orange-500/20 group-hover:scale-105 active:scale-95">
            <div className="absolute -inset-3 border border-orange-500/0 rounded-full group-hover:border-orange-500/20 group-hover:animate-orbit-slow transition-all pointer-events-none">
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#F27124] rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_#F27124]"></div>
            </div>

            <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm transition-transform duration-500 font-mono">
              <AvatarImage
                src={user.avatar_url}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-[10px] font-black bg-slate-900 dark:bg-slate-800 text-white italic">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            {/* Status Dot */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 shadow-sm group-hover:animate-pulse"></span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 mt-3 p-2 rounded-[32px] shadow-2xl border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 font-sans"
        align="end"
        forceMount
      >
        {/* --- USER INFO BENTO CARD --- */}
        <DropdownMenuLabel className="font-normal p-2 mb-2">
          <div className="flex flex-col space-y-3 bg-white/50 dark:bg-slate-800/50 p-4 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 transition-transform duration-500 group-hover:rotate-0 dark:opacity-20">
              <Sparkles className="w-12 h-12 text-slate-900 dark:text-white" />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <Avatar className="h-10 w-10 rounded-xl border border-slate-100 dark:border-slate-700">
                  <AvatarImage src={user.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-orange-100 dark:bg-orange-900/20 text-[#F27124] font-black">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                {user.is_verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-800">
                    <BadgeCheck className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[140px] leading-tight capitalize">
                  {displayName.toLowerCase()}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium tracking-tight">
                  {displayEmail.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="pt-1 relative z-10">
              <span
                className={`inline-flex items-center text-[9px] font-bold px-3 py-1 rounded-lg border shadow-sm uppercase tracking-widest ${getRoleStyle(
                  user.role,
                )}`}
              >
                {user.role} ACCOUNT
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800" />

        {/* --- MENU ITEMS --- */}
        <div className="text-[12px] font-medium px-1 pb-1 dark:text-slate-300">
          <UserMenuItems
            role={user.role}
            isLogoutPending={isLogoutPending}
            onLogout={handleLogout}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
