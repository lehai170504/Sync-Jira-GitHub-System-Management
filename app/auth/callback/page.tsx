"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGoogleCallback } from "@/features/auth/hooks/use-auth";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Gọi Hook xử lý callback
  const { mutate: handleCallback } = useGoogleCallback();

  // Dùng ref để đảm bảo chỉ gọi API 1 lần (tránh React.StrictMode gọi 2 lần ở dev)
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");

    // 1. Nếu Google trả về lỗi (User từ chối)
    if (error) {
      calledRef.current = true;
      router.push("/login?error=access_denied");
      return;
    }

    // 2. Nếu có code -> Gọi API Backend
    if (code) {
      calledRef.current = true;
      handleCallback({
        code,
        state: state || undefined,
      });
    } else {
      // Không có code -> Quay về login
      router.push("/login");
    }
  }, [searchParams, handleCallback, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      {/* Hiệu ứng Loading */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-100 opacity-75"></span>
        <div className="relative inline-flex rounded-full h-12 w-12 bg-orange-50 items-center justify-center">
          <Loader2 className="h-6 w-6 text-[#F27124] animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">
          Đang xác thực...
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          Vui lòng đợi trong giây lát, chúng tôi đang kết nối với hệ thống.
        </p>
      </div>
    </div>
  );
}
