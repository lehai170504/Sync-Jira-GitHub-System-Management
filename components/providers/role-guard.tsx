"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useProfile } from "@/features/auth/hooks/use-profile";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Nếu đang tải dữ liệu profile hoặc chưa có data thì chưa làm gì cả
    if (isLoading || !data?.user) return;

    const role = data.user.role?.toUpperCase();

    // 1. Cập nhật (hoặc tạo mới) cookie user_role để Middleware dùng cho các lần tải trang sau
    Cookies.set("user_role", role);

    // 2. Xử lý điều hướng cho Sinh viên (STUDENT)
    if (role === "STUDENT") {
      // Nếu sinh viên vào thẳng dashboard mà CHƯA chọn lớp (không có cookie student_class_id)
      const classId = Cookies.get("student_class_id");
      if (pathname === "/dashboard" && !classId) {
        router.push("/courses");
      }
    }

    // 3. Xử lý điều hướng cho Giảng viên (LECTURER)
    if (role === "LECTURER" && pathname === "/dashboard") {
      router.push("/lecturer/courses");
    }
  }, [data, isLoading, pathname, router]);

  return <>{children}</>;
}
