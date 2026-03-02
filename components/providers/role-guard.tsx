"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useProfile } from "@/features/auth/hooks/use-profile";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    // Chỉ redirect về /lecturer/courses khi lecturer vào /dashboard CHƯA chọn lớp (không có classId trong URL hoặc cookie)
    if (role === "LECTURER" && pathname === "/dashboard") {
      const urlClassId = searchParams.get("classId");
      const cookieClassId = Cookies.get("lecturer_class_id");
      if (!urlClassId && !cookieClassId) {
        router.push("/lecturer/courses");
      }
    }
  }, [data, isLoading, pathname, searchParams, router]);

  return <>{children}</>;
}
