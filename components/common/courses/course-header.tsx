"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, Loader2, Bell, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

// Hooks
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useProfile } from "@/features/auth/hooks/use-profile";

// 👇 Import Menu Items chung
import { UserMenuItems } from "../user-menu-items";

interface CourseHeaderProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export function CourseHeader({ title, description, icon }: CourseHeaderProps) {
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const user = profile?.user;

  return (
    // Thêm font-mono vào header để áp dụng cho toàn bộ con
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl transition-all duration-300 font-mono">
      {/* Container giãn rộng cho Full Screen */}
      <div className="w-full max-w-[1920px] mx-auto flex h-20 items-center justify-between px-8 md:px-12">
        {/* --- LEFT: BRANDING --- */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-5 transition-transform active:scale-95"
          >
            <div className="relative w-32 h-10">
              <Image
                src="/images/Logo_Trường_Đại_học_FPT.svg.png"
                alt="FPT Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
            <div className="relative w-40 h-12 hidden md:block group">
              <Image
                src="/images/logo-sync.png"
                alt="SyncSystem Logo"
                fill
                className="object-contain filter transition-all duration-300 group-hover:brightness-110"
                priority
              />
            </div>
          </Link>

          {/* Search bar với font-mono */}
          <div className="hidden lg:flex items-center bg-slate-100/80 rounded-2xl px-4 py-2 w-80 border border-transparent focus-within:border-orange-500/50 focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="SEARCH..."
              className="bg-transparent border-none text-sm outline-none w-full font-mono uppercase tracking-tighter"
            />
          </div>
        </div>

        {/* --- RIGHT: ACTIONS & PROFILE --- */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-2xl h-11 w-11 text-slate-500 hover:bg-slate-100 hidden sm:flex border border-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-orange-500 rounded-full border-2 border-white" />
            </Button>
          </div>

          {isProfileLoading ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <div className="hidden md:flex flex-col items-end gap-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              {/* User Identity với font-mono */}
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-base font-bold text-slate-900 leading-tight tracking-tighter">
                  {user?.full_name?.toUpperCase() || "USER"}
                </span>
                <span className="text-xs font-medium text-slate-400 lowercase tracking-tight">
                  {user?.email}
                </span>
              </div>

              {/* Enhanced Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group relative flex items-center gap-1 focus:outline-none">
                    <div className="rounded-full p-1 transition-all duration-300 group-hover:ring-4 group-hover:ring-orange-500/10">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-1 ring-slate-200 transition-transform group-hover:scale-105 font-mono">
                        <AvatarImage
                          src={user?.avatar_url}
                          alt={user?.full_name}
                        />
                        <AvatarFallback className="bg-gradient-to-tr from-[#F27124] to-[#ff9b5e] text-white text-lg font-bold">
                          {user?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 mt-4 p-3 rounded-[24px] shadow-2xl border-slate-100 bg-white/95 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200 font-mono"
                >
                  <DropdownMenuLabel className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 shadow-sm">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-orange-500 text-white font-bold font-mono">
                          {user?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-base font-bold text-slate-900 leading-none tracking-tighter">
                          {user?.full_name?.toUpperCase()}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[160px] lowercase">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="mx-2 bg-slate-100" />

                  {/* Truyền font-mono vào UserMenuItems nếu component đó nhận className, 
                      hoặc nó sẽ tự kế thừa từ Content cha */}
                  <div className="font-mono uppercase text-[12px]">
                    <UserMenuItems
                      role={user?.role}
                      isLogoutPending={isLogoutPending}
                      onLogout={() => logout()}
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
