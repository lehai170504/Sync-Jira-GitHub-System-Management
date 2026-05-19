"use client";

import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { useLogout } from "@/features/auth/hooks/use-logout";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { UserMenuItems } from "../user-menu-items";
import { NotificationsNav } from "@/components/layouts/notifications-nav";

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
    <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-white/5 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-3xl transition-all duration-500">
      <div className="w-full max-w-[1920px] mx-auto flex h-20 items-center justify-between px-8 md:px-12">
        {/* --- LEFT: BRANDING --- */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-5 transition-all hover:opacity-90 active:scale-95"
          >
            {/* --- LOGO FPT --- */}
            <div className="relative w-36 h-12 flex-shrink-0">
              <Image
                src="/images/Logo_Trường_Đại_học_FPT.svg.png"
                alt="FPT Logo"
                fill
                className="object-contain transition-all"
                priority
              />
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-slate-200 dark:bg-white/15 hidden sm:block transition-colors" />

            {/* --- GRAPHGRADE LOGO + TEXT --- */}
            <div className="hidden md:flex items-center gap-3 group">
              {/* Logo icon trên nền trắng */}
              <div className="relative h-14 w-14 flex-shrink-0 rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-slate-200/70 dark:ring-white/10 transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo-icon.png"
                  alt="GraphGrade Icon"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>

              {/* Chữ GraphGrade bên cạnh */}
              <div className="relative w-44 h-14">
                <Image
                  src="/images/content.png"
                  alt="GraphGrade Logo"
                  fill
                  className="object-contain transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110 dark:brightness-0 dark:invert"
                  priority
                />
              </div>
            </div>
          </Link>
        </div>

        {/* --- RIGHT: ACTIONS & PROFILE --- */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 animate-fade-up">
            <ThemeToggle /> {/* Nút chuyển Dark/Light */}
            {/* Sử dụng Component Thông báo thật thay vì nút giả */}
            <NotificationsNav />
          </div>

          {isProfileLoading ? (
            <div className="flex items-center gap-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <div className="hidden md:flex flex-col items-end gap-2 text-right">
                <Skeleton className="h-4 w-24 rounded-md dark:bg-zinc-800" />
                <Skeleton className="h-3 w-36 rounded-md dark:bg-zinc-800" />
              </div>
              <Skeleton className="h-12 w-12 rounded-2xl dark:bg-zinc-800" />
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-6 border-l border-zinc-200 dark:border-zinc-800 transition-colors">
              <div className="hidden md:flex flex-col items-end text-right animate-fade-up">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight uppercase transition-colors">
                  {user?.full_name || "Người dùng"}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase opacity-60 transition-colors">
                  {user?.role?.toLowerCase()} Mode
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group relative focus:outline-none perspective-[1000px]">
                    <div className="relative rounded-2xl p-0.5 transition-all duration-500 group-hover:bg-gradient-to-tr group-hover:from-[#F27124] group-hover:to-orange-300 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                      <div className="absolute -inset-2 border border-orange-500/0 rounded-2xl group-hover:border-orange-500/20 group-hover:animate-orbit-slow transition-all"></div>

                      <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-95 group-active:scale-90 font-mono">
                        <AvatarImage
                          src={user?.avatar_url}
                          alt={user?.full_name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-slate-900 dark:bg-slate-800 text-white text-sm font-semibold ">
                          {user?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="absolute -bottom-1 -right-1 bg-[#F27124] text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-md border-2 border-white dark:border-slate-800 shadow-sm capitalize transition-colors">
                        {user?.role?.toLowerCase()}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 mt-4 p-5 rounded-[40px] shadow-2xl border-white/20 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 transition-all"
                >
                  <DropdownMenuLabel className="p-2 mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl border-2 border-orange-500/20 relative overflow-hidden transition-all group">
                        <AvatarImage
                          src={user?.avatar_url}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-orange-500/10 text-orange-500 font-bold text-lg">
                          {user?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
                          {user?.full_name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 opacity-60">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="-mx-1 mb-4 bg-zinc-100 dark:bg-zinc-800" />

                  <div className="space-y-1">
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
