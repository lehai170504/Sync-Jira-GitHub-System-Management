"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Component con chứa logic sử dụng useSearchParams
function JiraCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // 1. Đọc params từ URL
    const success = searchParams.get("success");
    const rawEmail = searchParams.get("email") || searchParams.get("username");
    // Không dùng email cho message nữa, chỉ log khi cần debug
    const email =
      rawEmail && rawEmail !== "null" && rawEmail !== "undefined"
        ? rawEmail
        : null;
    const error = searchParams.get("error");

    // 2. Xử lý kết quả qua Window Message (Dành cho luồng mở Popup)
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "OAUTH_CALLBACK",
          provider: "jira",
          success: success === "true",
          email,
          error,
        },
        window.location.origin,
      );
      // Tự động đóng cửa sổ popup
      window.close();
    } else {
      // 3. Fallback: Nếu không phải mở bằng popup
      if (success === "true") {
        toast.success("Kết nối Jira thành công!");
      } else {
        toast.error(
          "Kết nối Jira thất bại: " + (error || "Lỗi không xác định"),
        );
      }
      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-6 transition-colors font-sans">
      <div className="relative">
        <div className="absolute inset-0 bg-[#0052CC]/20 rounded-full animate-ping"></div>
        <div className="relative bg-white dark:bg-slate-900 p-5 rounded-full shadow-xl border border-blue-100 dark:border-blue-900/50">
          <Loader2 className="h-10 w-10 animate-spin text-[#0052CC] dark:text-blue-500" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Đang hoàn tất kết nối Jira...
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm font-medium">
          Đang đồng bộ thông tin từ Atlassian. Cửa sổ này sẽ tự động đóng.
        </p>
      </div>
    </div>
  );
}

// Component cha: Bọc Suspense để vượt qua lỗi Build của Next.js
export default function JiraCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="h-10 w-10 animate-spin text-[#0052CC] dark:text-blue-500" />
        </div>
      }
    >
      <JiraCallbackContent />
    </Suspense>
  );
}
