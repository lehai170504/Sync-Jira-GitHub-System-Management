"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useActiveClassId } from "@/hooks/use-active-class-id";
import Cookies from "js-cookie";

import { AdminDashboard } from "@/features/admin/components/dashboard/admin-dashboard";
import { LecturerDashboard } from "@/features/dashboard/components/lecturer-view";
import { LeaderDashboard } from "@/features/dashboard/components/student-view";
import { MemberDashboard } from "@/features/dashboard/components/member-view";
import { MyGradesDialog } from "@/features/dashboard/components/my-grades-dialog";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: profileData, isLoading } = useProfile();
  const activeClassId = useActiveClassId();

  const user = profileData?.user;
  const role = user?.role as "ADMIN" | "LECTURER" | "STUDENT" | undefined;
  const displayName = user?.full_name || user?.email || "—";
  const isLeader = Cookies.get("student_is_leader") === "true";

  const greeting = useMemo(() => getGreeting(), []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const roleMeta = {
    ADMIN: { label: "Quản trị viên", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
    LECTURER: { label: "Giảng viên", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    STUDENT: { label: "Sinh viên", color: "bg-orange-100 text-[#F27124] dark:bg-orange-900/30 dark:text-orange-300" },
  };
  const currentRoleMeta = roleMeta[role ?? "STUDENT"];

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* ===== HEADER: Greeting ===== */}
        {role !== "ADMIN" && (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm px-8 py-7 flex flex-wrap items-center justify-between gap-4 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Sparkles className="w-36 h-36 text-[#F27124]" />
            </div>
            <div className="space-y-1.5 relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {greeting} 👋
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {displayName}
              </h1>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${currentRoleMeta.color}`}>
                {currentRoleMeta.label}
              </span>
            </div>

            {role === "STUDENT" && (
              <div className="relative z-10">
                <MyGradesDialog classId={activeClassId} />
              </div>
            )}
          </div>
        )}

        {/* ===== 1. ADMIN VIEW ===== */}
        {role === "ADMIN" && <AdminDashboard />}

        {/* ===== 2. LECTURER VIEW ===== */}
        {role === "LECTURER" && (
          <LecturerDashboard classId={activeClassId} />
        )}

        {/* ===== 3. STUDENT VIEW ===== */}
        {role === "STUDENT" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLeader ? (
              <LeaderDashboard />
            ) : (
              <MemberDashboard classId={activeClassId} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
