import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  getGoogleAuthUrlApi, // Import hàm vừa sửa ở trên
  googleCallbackApi,
  GoogleCallbackParams,
} from "../api/auth-api";

// --- HOOK 1: LOGIN VỚI GOOGLE ---
export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async () => {
      // Frontend URL để Google quay về
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

// --- HOOK 2: XỬ LÝ CALLBACK (Giữ nguyên không đổi) ---
export const useGoogleCallback = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: GoogleCallbackParams) => googleCallbackApi(params),
    onSuccess: (data) => {
      if (data?.accessToken) {
        Cookies.set("token", data.accessToken);
        Cookies.set("refreshToken", data.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Đăng nhập thành công!");
      router.push("/courses");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
      router.push("/login?error=google_failed");
    },
  });
};
