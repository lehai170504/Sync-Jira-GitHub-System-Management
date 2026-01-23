"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function JiraCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // 1. Đọc params từ URL
    const success = searchParams.get("success");
    const email = searchParams.get("email") || searchParams.get("username");
    const error = searchParams.get("error");

    // 2. Xử lý
    if (success === "true") {
      toast.success(`Kết nối Jira thành công! Tài khoản: ${email}`);
      router.refresh(); // Refresh để cập nhật state ở Dashboard
      router.replace("/config");
    } else {
      toast.error("Kết nối Jira thất bại: " + (error || "Lỗi không xác định"));
      router.replace("/config");
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-[#0052CC]/20 rounded-full animate-ping"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-blue-100">
          <Loader2 className="h-12 w-12 animate-spin text-[#0052CC]" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">
          Đang hoàn tất kết nối Jira...
        </h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
          Đang đồng bộ thông tin từ Atlassian. Vui lòng chờ trong giây lát.
        </p>
      </div>
    </div>
  );
}
