"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
// Không cần dùng hook verifyGithub nữa vì Backend đã tự làm rồi

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

    // 2. Xử lý kết quả
    if (success === "true") {
      toast.success(`Kết nối GitHub thành công! Tài khoản: ${username}`);

      // Làm mới dữ liệu
      router.refresh();
      // Chuyển hướng về trang cấu hình
      router.replace("/config");
    } else {
      // Trường hợp thất bại
      toast.error("Kết nối thất bại: " + (error || "Lỗi không xác định"));
      router.replace("/config");
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-slate-200">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">
          Đang hoàn tất kết nối...
        </h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
          Đã nhận diện tài khoản{" "}
          <strong>{searchParams.get("username") || "GitHub"}</strong>. Đang đưa
          bạn quay lại hệ thống.
        </p>
      </div>
    </div>
  );
}
