"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useProfile } from "@/features/auth/hooks/use-profile";

// FIX: Không nhận children nữa, component này chỉ chạy ngầm logic
export function RoleGuard() {
  const { data, isLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading || !data?.user) return;

    const role = data.user.role?.toUpperCase();
    Cookies.set("user_role", role);

    if (role === "STUDENT") {
      const classId = Cookies.get("student_class_id");
      if (pathname === "/dashboard" && !classId) {
        router.push("/courses");
      }
    }

    if (role === "LECTURER" && pathname === "/dashboard") {
      const urlClassId = searchParams.get("classId");
      const cookieClassId = Cookies.get("lecturer_class_id");
      if (!urlClassId && !cookieClassId) {
        router.push("/lecturer/courses");
      }
    }
  }, [data, isLoading, pathname, searchParams, router]);

  // Trả về null để không can thiệp vào giao diện
  return null;
}
