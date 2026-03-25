"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/use-profile";

// Import các Dashboard Component
import { AdminDashboard } from "@/features/admin/components/dashboard/admin-dashboard";
import { LecturerDashboard } from "@/features/dashboard/lecturer-view";
import { LeaderDashboard } from "@/features/dashboard/student-view";
import { MemberDashboard } from "@/features/dashboard/member-view";
import { MyGradesDialog } from "@/features/dashboard/my-grades-dialog";

type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

interface UserInfo {
  name: string;
  role: UserRole;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlClassId = searchParams.get("classId") ?? undefined;

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);
  const [activeClassId, setActiveClassId] = useState<string | undefined>(
    urlClassId,
  );

  const { data: profileData } = useProfile();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const savedRole = Cookies.get("user_role") as UserRole;
    const savedName = Cookies.get("user_name");
    const savedEmail = Cookies.get("user_email");
    const studentIsLeader = Cookies.get("student_is_leader") === "true";
    let cookieClassId: string | undefined;

    if (savedRole === "LECTURER") {
      cookieClassId = Cookies.get("lecturer_class_id") ?? undefined;
    } else if (savedRole === "STUDENT") {
      cookieClassId = Cookies.get("student_class_id") ?? undefined;
    }

    if (savedRole) {
      setUser({
        role: savedRole,
        name: savedName || "",
        email: savedEmail || "",
      });
    } else {
      setUser({
        role: "STUDENT",
        name: "",
        email: "",
      });
    }
    setIsLeader(studentIsLeader);
    setActiveClassId((prev) => prev ?? cookieClassId);
    setIsLoading(false);
  }, [router, urlClassId]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    profileData?.user?.full_name ||
    user.name ||
    profileData?.user?.email ||
    user.email ||
    "—";

  return (
    // FIX: bg-white -> bg-white dark:bg-slate-950
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto py-6 px-4 md:px-8">
        {/* 1. ADMIN VIEW */}
        {user.role === "ADMIN" && <AdminDashboard />}

        {/* 2. LECTURER VIEW */}
        {user.role === "LECTURER" && (
          <LecturerDashboard classId={activeClassId} />
        )}

        {/* 3. STUDENT VIEW */}
        {user.role === "STUDENT" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                    {displayName}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Chúc bạn một ngày học tập hiệu quả.
                  </p>
                </div>
                <MyGradesDialog classId={activeClassId} />
              </div>
            </div>
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
