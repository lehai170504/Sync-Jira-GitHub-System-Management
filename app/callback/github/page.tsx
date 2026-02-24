"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GithubCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // 1. Đọc các tham số Backend trả về
    const success = searchParams.get("success");
    const username = searchParams.get("username");
    const error = searchParams.get("error");

    // 2. Xử lý kết quả qua Window Message (Dành cho luồng mở Popup)
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "OAUTH_CALLBACK",
          provider: "github",
          success: success === "true",
          username,
          error,
        },
        window.location.origin,
      );
      // Tự động đóng cửa sổ popup sau khi gửi message
      window.close();
    } else {
      // 3. Fallback: Nếu không phải mở bằng popup (mở cùng tab)
      if (success === "true") {
        toast.success(`Kết nối GitHub thành công! Tài khoản: ${username}`);
      } else {
        toast.error("Kết nối thất bại: " + (error || "Lỗi không xác định"));
      }
      // Đưa về trang chủ hoặc dashboard tùy logic của bạn
      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-6 transition-colors font-sans">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        <div className="relative bg-white dark:bg-slate-900 p-5 rounded-full shadow-xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-500" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Đang hoàn tất kết nối...
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm font-medium">
          Đã nhận diện tài khoản{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            {searchParams.get("username") || "GitHub"}
          </strong>
          . Đang đóng cửa sổ này.
        </p>
      </div>
    </div>
  );
}
