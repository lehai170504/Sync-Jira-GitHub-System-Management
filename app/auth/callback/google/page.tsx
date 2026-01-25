"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Đăng nhập thất bại hoặc bị từ chối.");
      router.push("/login");
      return;
    }

    if (token) {
      Cookies.set("token", token, { path: "/", expires: 1 });
      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, { path: "/", expires: 7 });
      }

      queryClient.removeQueries({ queryKey: ["user-profile"] });

      toast.success("Đăng nhập thành công!");
      // console.log(token)
      window.location.href = "/courses";
    } else {
      router.push("/login");
    }
  }, [searchParams, router, queryClient]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-100 opacity-75"></span>
        <div className="relative inline-flex rounded-full h-12 w-12 bg-orange-50 items-center justify-center">
          <Loader2 className="h-6 w-6 text-[#F27124] animate-spin" />
        </div>
      </div>
      <p className="text-sm text-slate-500">Đang xử lý đăng nhập...</p>
    </div>
  );
}
