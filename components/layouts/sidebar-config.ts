// src/components/layouts/sidebar-config.ts
import {
  LayoutDashboard,
  CalendarRange,
  School,
  ShieldAlert,
  GitCommit,
  CalendarDays,
  BookOpen,
  Layers,
  ClipboardCheck,
  BarChart3,
  Settings2,
  FileText,
  Activity,
  Star,
  LayoutList,
  Settings,
  LucideIcon,
} from "lucide-react";

export type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

export type RouteItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
};

export type RouteGroup = {
  label: string;
  roles: UserRole[];
  items: RouteItem[];
};

export const routeGroups: RouteGroup[] = [
  {
    label: "Tổng quan",
    roles: ["ADMIN", "LECTURER", "STUDENT"],
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
    label: "Quản trị hệ thống",
    roles: ["ADMIN"],
    items: [
      {
        label: "Học kỳ & Môn học",
        icon: CalendarRange,
        href: "/admin/academic",
        color: "text-orange-500",
      },
      {
        label: "Quản lý Lớp học",
        icon: School,
        href: "/admin/classes",
        color: "text-blue-500",
      },
      {
        label: "Người dùng & Quyền",
        icon: ShieldAlert,
        href: "/admin/users",
        color: "text-gray-400",
      },
      {
        label: "Nhật ký hệ thống",
        icon: GitCommit,
        href: "/admin/logs",
        color: "text-red-700",
      },
    ],
  },
  {
    label: "Giảng viên",
    roles: ["LECTURER"],
    items: [
      {
        label: "Lịch giảng dạy",
        icon: CalendarDays,
        href: "/lecturer/schedule",
        color: "text-blue-500",
      },
      {
        label: "Lớp học của tôi",
        icon: BookOpen,
        href: "/lecturer/class-management",
        color: "text-indigo-500",
      },
      {
        label: "Bài tập & Đồ án",
        icon: Layers,
        href: "/lecturer/assignments",
        color: "text-orange-500",
      },
      {
        label: "Sổ điểm & Đánh giá",
        icon: ClipboardCheck,
        href: "/lecturer/grading",
        color: "text-emerald-500",
      },
      {
        label: "Thống kê & Báo cáo",
        icon: BarChart3,
        href: "/lecturer/reports",
        color: "text-rose-500",
      },
      {
        label: "Cấu hình môn học",
        icon: Settings2,
        href: "/lecturer/settings",
        color: "text-slate-500",
      },
    ],
  },
  {
    label: "Học tập & Đồ án",
    roles: ["STUDENT"],
    items: [
      {
        label: "Kết quả học tập",
        icon: Layers,
        href: "/my-score",
        color: "text-yellow-500",
      },
      {
        label: "Nhiệm vụ (Tasks)",
        icon: FileText,
        href: "/tasks",
        color: "text-rose-500",
      },
      {
        label: "Tiến độ nhóm",
        icon: Activity,
        href: "/progress",
        color: "text-emerald-400",
      },
      {
        label: "Lịch sử Commit",
        icon: GitCommit,
        href: "/commits",
        color: "text-slate-300",
      },
      {
        label: "Đánh giá chéo",
        icon: Star,
        href: "/peer-review",
        color: "text-amber-500",
      },
    ],
  },
  {
    label: "Công cụ & Cài đặt",
    roles: ["STUDENT"],
    items: [
      {
        label: "Đồng bộ dữ liệu",
        icon: LayoutList,
        href: "/sync",
        color: "text-sky-500",
      },
      {
        label: "Cấu hình nhóm",
        icon: Settings,
        href: "/config",
        color: "text-violet-500",
      },
    ],
  },
];
