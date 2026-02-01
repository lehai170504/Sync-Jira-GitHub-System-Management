"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
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

// Import Menu Items chung
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/60 backdrop-blur-2xl transition-all duration-500 font-mono animate-reveal">
      <div className="w-full max-w-[1920px] mx-auto flex h-20 items-center justify-between px-8 md:px-12">
        {/* --- LEFT: BRANDING & SEARCH --- */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-5 transition-all hover:opacity-80 active:scale-95"
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
                className="object-contain transition-all duration-500 group-hover:brightness-125 group-hover:contrast-125"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center bg-slate-100/50 rounded-2xl px-4 py-2 w-80 border border-slate-200/50 focus-within:border-[#F27124]/50 focus-within:bg-white focus-within:w-96 focus-within:shadow-xl focus-within:shadow-orange-500/5 transition-all duration-500 group">
            <Search className="h-4 w-4 text-slate-400 mr-2 group-focus-within:text-[#F27124] transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              className="bg-transparent border-none text-[11px] font-bold outline-none w-full tracking-tight"
            />
            <div className="px-1.5 py-0.5 rounded border border-slate-200 text-[9px] text-slate-400 font-black">
              /
            </div>
          </div>
        </div>

        {/* --- RIGHT: ACTIONS & PROFILE --- */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 animate-fade-up">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-2xl h-11 w-11 text-slate-500 hover:bg-white hover:border-slate-200 hover:shadow-sm border border-transparent transition-all"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-[#F27124] rounded-full border-2 border-white animate-pulse" />
            </Button>
          </div>

          {isProfileLoading ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <div className="hidden md:flex flex-col items-end gap-2 text-right">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
              <Skeleton className="h-12 w-12 rounded-2xl" />
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="hidden md:flex flex-col items-end text-right animate-fade-up">
                <span className="text-sm font-black text-slate-900 leading-tight tracking-tighter italic">
                  {user?.full_name || "Người dùng"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-tight opacity-70">
                  {user?.email}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group relative focus:outline-none [perspective:1000px]">
                    <div className="relative rounded-2xl p-0.5 transition-all duration-500 group-hover:bg-gradient-to-tr group-hover:from-[#F27124] group-hover:to-orange-300 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                      <div className="absolute -inset-2 border border-orange-500/0 rounded-2xl group-hover:border-orange-500/20 group-hover:animate-orbit-slow transition-all"></div>

                      <Avatar className="h-12 w-12 border-2 border-white rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-95 group-active:scale-90 font-mono">
                        <AvatarImage
                          src={user?.avatar_url}
                          alt={user?.full_name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-slate-900 text-white text-sm font-black italic">
                          {user?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="absolute -bottom-1 -right-1 bg-[#F27124] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md border-2 border-white shadow-sm capitalize">
                        {user?.role?.toLowerCase()}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 mt-4 p-4 rounded-[32px] shadow-2xl border-slate-100 bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 font-mono"
                >
                  <DropdownMenuLabel className="p-2 mb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-2xl border border-orange-100 relative overflow-hidden">
                        <AvatarImage
                          src={user?.avatar_url}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-[#F27124]/10 text-[#F27124] font-black italic">
                          {user?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <p className="text-sm font-black text-slate-900 leading-none italic">
                          {user?.full_name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 opacity-70">
                          Tài khoản {user?.role?.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="mx-[-4px] mb-2 bg-slate-50" />

                  <div className="text-[11px] font-bold tracking-tight">
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
