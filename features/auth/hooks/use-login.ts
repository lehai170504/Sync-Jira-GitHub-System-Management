"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { loginApi, LoginCredentials } from "../api/login-api";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (data) => {
      // 1. Lưu thông tin xác thực (Rất nhanh, diễn ra tại máy client)
      Cookies.set("token", data.access_token, { expires: 1 });
      Cookies.set("refreshToken", data.refresh_token, { expires: 7 });
      Cookies.set("user_role", data.user.role, { expires: 1 });
      Cookies.set("user_email", data.user.email, { expires: 1 });
      Cookies.set("user_name", data.user.full_name, { expires: 1 });

      toast.success(`Chào mừng quay lại, ${data.user.full_name}!`);

      // 2. Xác định đường dẫn đích
      let targetUrl = "/dashboard";
      switch (data.user.role) {
        case "LECTURER":
          targetUrl = "/lecturer/courses";
          break;
        case "ADMIN":
          targetUrl = "/dashboard";
          break;
        default:
          targetUrl = "/courses";
          break;
      }

      // 3. ĐIỀU HƯỚNG TỨC THÌ
      // Không await FCM ở đây nữa để tránh làm chậm trải nghiệm người dùng
      window.location.href = targetUrl;
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (error.response?.status === 403 && errorData?.requires_verification) {
        toast.warning("Tài khoản chưa xác thực email!", {
          description: "Vui lòng kiểm tra email để lấy OTP.",
          action: {
            label: "Nhập OTP",
            onClick: () =>
              router.push(`/verify-otp?email=${errorData.email || ""}`),
          },
        });
      } else if (error.response?.status === 401) {
        toast.error("Sai email hoặc mật khẩu.");
      } else {
        toast.error(
          errorData?.message || errorData?.error || "Đăng nhập thất bại.",
        );
      }
    },
  });
};
