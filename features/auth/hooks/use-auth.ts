import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  getGoogleAuthUrlApi,
  googleCallbackApi,
  GoogleCallbackParams,
} from "../api/auth-api";

// --- HOOK 1: LOGIN VỚI GOOGLE (Ở trang Login) ---
export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async () => {
      // Tạo redirect_uri trỏ về trang Callback của Frontend
      const redirectUri = `${window.location.origin}/auth/callback`;
      return getGoogleAuthUrlApi(redirectUri);
    },
    onSuccess: (url) => {
      if (url) {
        // Chuyển hướng người dùng sang Google
        window.location.href = url;
      } else {
        toast.error("Không nhận được liên kết đăng nhập từ hệ thống.");
      }
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Lỗi khởi tạo đăng nhập Google.");
    },
  });
};

// --- HOOK 2: XỬ LÝ CALLBACK (Ở trang Callback) ---
export const useGoogleCallback = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: GoogleCallbackParams) => googleCallbackApi(params),
    onSuccess: (data) => {
      // 1. Lưu Token vào Cookie/Storage
      if (data?.accessToken) {
        Cookies.set("accessToken", data.accessToken);
        Cookies.set("refreshToken", data.refreshToken);
      }

      // 2. Làm mới trạng thái user (nếu dùng React Query quản lý user)
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      // 3. Thông báo & Chuyển hướng vào Dashboard
      toast.success("Đăng nhập thành công! Đang chuyển hướng...");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
      // Nếu lỗi, quay về trang login
      router.push("/login?error=google_failed");
    },
  });
};
