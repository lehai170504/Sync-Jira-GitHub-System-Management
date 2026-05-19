"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav";
import { Footer } from "@/components/layouts/footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { OmniAgentChat } from "@/features/lecturer/components/omni-agent-chat";
import { WelcomeModal } from "@/components/common/welcome-modal";
import { useActiveClassId } from "@/hooks/use-active-class-id";
import { UserRole } from "@/components/layouts/sidebar-config";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Tổng quan",
  "class-management": "Quản lý lớp học",
  admin: "Quản trị",
  academic: "Học kỳ & Môn học",
  classes: "Lớp học",
  users: "Người dùng",
  lecturer: "Giảng viên",
  schedule: "Lịch giảng dạy",
  projects: "Đồ án",
  settings: "Cài đặt",
  reviews: "Đánh giá",
  calculate: "Tính điểm",
  class: "Danh sách lớp",
  project: "Dự án",
  team: "Nhóm",
  mapping: "Liên kết tài khoản",
  tasks: "Nhiệm vụ",
  timeline: "Timeline Sprint",
  progress: "Tiến độ nhóm",
  commits: "Commits",
  "peer-review": "Đánh giá chéo",
};

function getPageLabel(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).pop() ?? "";
  return ROUTE_LABELS[segment] ?? segment.replace(/-/g, " ").toUpperCase();
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  const activeClassId = useActiveClassId();

  const { data, isLoading } = useProfile();
  const user = data?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFullScreenPage = ["/lecturer/courses", "/courses"].includes(pathname);

  if (isFullScreenPage) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans">
        {children}
      </div>
    );
  }

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  if (!mounted) return null;

  const pageLabel = getPageLabel(pathname);

  const roleBadgeClass =
    user?.role === "ADMIN"
      ? "text-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
      : user?.role === "LECTURER"
        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
        : "text-[#F27124] bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col fixed inset-y-0 left-0 z-[80]",
          "transition-all duration-500 ease-in-out",
          "bg-slate-950 dark:bg-black border-r border-slate-800 shadow-xl",
          isCollapsed ? "w-[72px]" : "w-72",
        )}
      >
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </aside>

      {/* ── MAIN COLUMN ── */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-500 ease-in-out",
          isCollapsed ? "md:ml-[72px]" : "md:ml-72",
        )}
      >
        {/* ── TOPBAR ── */}
        <header className="sticky top-0 z-40 shrink-0 h-16 flex items-center justify-between px-6 lg:px-8 border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hidden lg:block select-none">
              GraphGrade
            </span>
            <span className="text-slate-200 dark:text-slate-700 hidden lg:block select-none">
              /
            </span>
            <span className="text-[12px] font-bold tracking-wide text-slate-700 dark:text-slate-300 truncate">
              {pageLabel}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {(user?.role === "STUDENT" || user?.role === "LECTURER") && (
              <NotificationsNav />
            )}

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            <div className="flex items-center gap-3 group">
              {/* User info */}
              <div className="flex-col items-end hidden sm:flex">
                {isLoading ? (
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-2 w-14 rounded self-end" />
                  </div>
                ) : (
                  <>
                    <span className="text-[13px] font-bold leading-none text-slate-900 dark:text-slate-100 group-hover:text-[#F27124] transition-colors">
                      {user?.full_name || "Guest"}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-bold mt-1 px-1.5 py-0.5 leading-none rounded",
                        roleBadgeClass,
                      )}
                    >
                      {user?.role ?? "STUDENT"}
                    </span>
                  </>
                )}
              </div>
              <UserNav />
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
          <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full flex flex-col">
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="shrink-0 border-t border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
            <Footer />
          </div>
        </footer>
      </div>

      {/* ── OMNI AGENT (chỉ LECTURER có classId) ── */}
      {activeClassId && user?.role === "LECTURER" && (
        <OmniAgentChat classId={activeClassId} />
      )}

      {/* ── WELCOME MODAL (lần đầu đăng nhập) ── */}
      {user && (
        <WelcomeModal
          role={user.role as UserRole}
          userName={user.full_name || "User"}
        />
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 animate-pulse" />
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
