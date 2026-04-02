"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { isBackendUnavailable } from "@/lib/backend-health";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const hasToken = !!Cookies.get("token");
  const { data, isLoading, isError, error, refetch, isFetching } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showMaintenance =
    hasToken &&
    !isLoading &&
    isError &&
    error &&
    isBackendUnavailable(error);

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

  if (showMaintenance) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-slate-950/95 px-6 text-center text-slate-100">
        <div className="flex max-w-md flex-col items-center gap-4">
          <div className="rounded-full bg-amber-500/15 p-4">
            <AlertTriangle className="h-12 w-12 text-amber-400" aria-hidden />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Hệ thống đang tạm ngưng hoặc bảo trì
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Máy chủ (API) không phản hồi tạm thời (502/503). Vui lòng thử lại sau
            vài phút. Trang không bị chuyển sang 404.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}