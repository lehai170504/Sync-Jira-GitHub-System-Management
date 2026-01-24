"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  getGoogleAuthUrlApi,
  googleCallbackApi,
  GoogleCallbackParams,
} from "../api/auth-api";

// --- HOOK 1: LOGIN VỚI GOOGLE ---
export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async () => {
      const redirectUri = window.location.origin;
      return await getGoogleAuthUrlApi(redirectUri);
    },
    onSuccess: (googleUrl) => {
      if (googleUrl) {
        window.location.href = googleUrl;
      } else {
        toast.error("Hệ thống không trả về đường dẫn đăng nhập.");
      }
    },
    onError: (error: any) => {
      console.error("Google Login Error:", error);
      toast.error("Không thể kết nối tới máy chủ.");
    },
  });
};

// --- HOOK 2: XỬ LÝ CALLBACK (ĐÃ TỐI ƯU TỐC ĐỘ) ---
export const useGoogleCallback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: GoogleCallbackParams) => googleCallbackApi(params),
    onSuccess: (data) => {
      // 1. Lưu Tokens vào Cookie (Xử lý đồng bộ, cực nhanh)
      if (data?.accessToken) {
        Cookies.set("token", data.accessToken, { expires: 1 });
        Cookies.set("refreshToken", data.refreshToken, { expires: 7 });
      }

      // 2. Lưu thông tin User
      if (data?.user) {
        Cookies.set("user_role", data.user.role, { expires: 1 });
        Cookies.set("user_name", data.user.full_name, { expires: 1 });
      }

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(`Chào mừng ${data.user?.full_name || "bạn"}!`);

      // 3. Xác định đường dẫn đích
      let targetUrl = "/courses";
      if (data.user?.role === "LECTURER") targetUrl = "/lecturer/courses";
      if (data.user?.role === "ADMIN") targetUrl = "/dashboard";

      // 4. Chuyển hướng ngay lập tức (Hard Navigation)
      window.location.href = targetUrl;
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
      window.location.href = "/login?error=google_failed";
    },
  });
};
