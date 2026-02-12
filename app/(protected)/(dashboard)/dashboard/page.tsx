"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// Import các Dashboard Component
import { AdminDashboard } from "@/features/admin/components/dashboard/admin-dashboard";
import { LecturerDashboard } from "@/components/features/dashboard/lecturer-view";
import { MemberDashboard } from "@/components/features/dashboard/member-view";

type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

interface UserInfo {
  name: string;
  role: UserRole;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Logic lấy ClassID (Giữ nguyên)
  const urlClassId = searchParams.get("classId");
  const cookieClassId =
    typeof window !== "undefined"
      ? Cookies.get(
          Cookies.get("user_role") === "LECTURER"
            ? "lecturer_class_id"
            : "student_class_id",
        )
      : undefined;
  const activeClassId = urlClassId || cookieClassId;

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logic Auth (Giữ nguyên)
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const savedRole = Cookies.get("user_role") as UserRole;
    const savedName = Cookies.get("user_name");
    const savedEmail = Cookies.get("user_email");

    if (savedRole) {
      setUser({
        role: savedRole,
        name: savedName || "Người dùng",
        email: savedEmail || "",
      });
    } else {
      // Fallback
      setUser({
        role: "STUDENT",
        name: "Sinh viên",
        email: "",
      });
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F27124]" />
      </div>
    );
  }

  if (!user) return null;

  // Render Dashboard dựa trên Role
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto py-6 px-4 md:px-8">
        {/* 1. ADMIN VIEW (Mới) */}
        {user.role === "ADMIN" && <AdminDashboard />}

        {/* 2. LECTURER VIEW */}
        {user.role === "LECTURER" && (
          <LecturerDashboard classId={activeClassId} />
        )}

        {/* 3. STUDENT VIEW */}
        {user.role === "STUDENT" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Xin chào, {user.name}!
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                Chúc bạn một ngày học tập hiệu quả.
              </p>
            </div>
            <MemberDashboard classId={activeClassId} />
          </div>
        )}
      </div>
    </div>
  );
}
