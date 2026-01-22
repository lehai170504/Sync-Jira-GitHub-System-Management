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
      // 1. Lưu Tokens (Access & Refresh)
      Cookies.set("token", data.access_token, { expires: 1 });
      Cookies.set("refreshToken", data.refresh_token, { expires: 7 });

      // 2. Lưu thông tin User
      Cookies.set("user_role", data.user.role, { expires: 1 });
      Cookies.set("user_email", data.user.email, { expires: 1 });
      Cookies.set("user_name", data.user.full_name, { expires: 1 });

      toast.success(`Chào mừng quay lại, ${data.user.full_name}!`);

      // 3. Điều hướng
      switch (data.user.role) {
        case "LECTURER":
          router.push("/lecturer/courses");
          break;
        case "ADMIN":
          router.push("/dashboard");
          break;
        default:
          router.push("/dashboard");
          break;
      }

      router.refresh();
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
