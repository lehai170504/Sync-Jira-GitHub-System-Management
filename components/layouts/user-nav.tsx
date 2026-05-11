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
import { UserMenuItems } from "../common/user-menu-items";
import { cn } from "@/lib/utils";

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

  const displayName = useMemo(() => user?.full_name || "Unknown User", [user]);
  const displayEmail = useMemo(() => user?.email || "—", [user]);
  const userInitial = useMemo(() => displayName.charAt(0).toUpperCase(), [displayName]);

  const roleMeta = useMemo(() => {
    switch (user?.role) {
      case "ADMIN":
        return {
          label: "ADMIN",
          badgeCls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
          dotCls: "bg-violet-500 dark:bg-violet-400",
        };
      case "LECTURER":
        return {
          label: "LECTURER",
          badgeCls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
          dotCls: "bg-blue-500 dark:bg-blue-400",
        };
      default:
        return {
          label: "STUDENT",
          badgeCls: "bg-orange-50 text-[#F27124] border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
          dotCls: "bg-[#F27124] dark:bg-orange-400",
        };
    }
  }, [user?.role]);

  if (isProfileLoading) {
    return (
      <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shadow-sm" />
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative focus:outline-none">
          <div className="relative rounded-full p-0.5 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#F27124]/40 group-hover:ring-offset-1 group-hover:ring-offset-white dark:group-hover:ring-offset-slate-950">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm transition-all duration-300 group-hover:scale-105 group-active:scale-95">
              <AvatarImage src={user.avatar_url} alt={displayName} className="object-cover" />
              <AvatarFallback className="text-[11px] font-bold bg-slate-800 dark:bg-slate-700 text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            {/* Status dot */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-sm" />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 mt-2 p-1.5 rounded-2xl shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 font-sans"
        align="end"
        forceMount
      >
        {/* User info card */}
        <DropdownMenuLabel className="font-normal p-1 mb-1">
          <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-2 right-2 opacity-[0.06] dark:opacity-[0.04] pointer-events-none">
              <Sparkles className="w-10 h-10 text-slate-900 dark:text-white" />
            </div>

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700">
                  <AvatarImage src={user.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-[#F27124]/10 text-[#F27124] font-bold text-sm rounded-xl">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                {user.is_verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900">
                    <BadgeCheck className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate capitalize leading-tight">
                  {displayName.toLowerCase()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {displayEmail}
                </span>
              </div>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-widest",
                roleMeta.badgeCls,
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", roleMeta.dotCls)} />
                {roleMeta.label} ACCOUNT
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-1 bg-slate-100 dark:bg-slate-800" />

        {/* Menu items */}
        <div className="px-0.5 pb-0.5">
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
