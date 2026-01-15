"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  GitCommit,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  HelpCircle,
  LogOut,
  Layers,
} from "lucide-react";

// Định nghĩa cấu trúc menu theo nhóm
const routeGroups = [
  {
    label: "Tổng quan",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
      },
    ],
  },
  {
    label: "Quản trị viên",
    items: [
      {
        label: "Cấu hình dự án",
        icon: Settings,
        href: "/admin/config", // Cập nhật đúng đường dẫn admin
        color: "text-violet-500",
      },
      {
        label: "Ánh xạ tài khoản",
        icon: Users,
        href: "/admin/mapping",
        color: "text-pink-700",
      },
      {
        label: "Báo cáo & Điểm",
        icon: FileText,
        href: "/admin/reports",
        color: "text-emerald-500",
      },
      {
        label: "Đồng bộ dữ liệu",
        icon: GitCommit,
        href: "/admin/sync",
        color: "text-blue-500",
      },
    ],
  },
  {
    label: "Sinh viên",
    items: [
      {
        label: "Kết quả học tập",
        icon: Layers,
        href: "/my-score",
        color: "text-yellow-500",
      },
      {
        label: "Đánh giá chéo",
        icon: GraduationCap,
        href: "/peer-review",
        color: "text-orange-700",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white border-r border-gray-800">
      {/* 1. Header Logo */}
      <div className="px-6 py-6 flex items-center">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="relative w-9 h-9 flex items-center justify-center bg-[#F27124] rounded-xl shadow-lg shadow-orange-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight leading-none">
              SyncSystem
            </h1>
            <span className="text-[10px] text-gray-400 font-medium mt-1">
              FPT Project Manager
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Scrollable Menu Area */}
      <div className="flex-1 px-4 space-y-6 overflow-y-auto py-4 scrollbar-hide">
        {routeGroups.map((group, index) => (
          <div key={index}>
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((route) => {
                const isActive =
                  pathname === route.href ||
                  pathname.startsWith(`${route.href}/`);

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "group flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gray-800/50 text-white shadow-sm border-l-4 border-[#F27124]"
                        : "text-gray-400 hover:bg-gray-800/30 hover:text-white"
                    )}
                  >
                    <route.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                        isActive
                          ? route.color
                          : "text-gray-500 group-hover:text-white"
                      )}
                    />
                    <span>{route.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer Section (System Status / User Help) */}
      <div className="p-4 mt-auto border-t border-gray-800 bg-[#0f1623]">
        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/20 rounded-lg p-4 border border-orange-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-orange-500/20 rounded-md">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Hệ thống ổn định
              </p>
              <p className="text-[10px] text-orange-200">v1.2.0 (Stable)</p>
            </div>
          </div>
          <Link
            href="#"
            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 mt-2 transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Xem tài liệu hướng dẫn</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
