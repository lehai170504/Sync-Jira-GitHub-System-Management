import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  requestResetOtpApi,
  resetPasswordApi,
  RequestResetOtpPayload,
  ResetPasswordPayload,
} from "../api/forgot-password-api";

// Hook Bước 1: Gửi OTP
export const useRequestResetOtp = (onSuccessCallback: () => void) => {
  return useMutation({
    mutationFn: (payload: RequestResetOtpPayload) =>
      requestResetOtpApi(payload),
    onSuccess: () => {
      toast.success("Mã xác thực đã được gửi!", {
        description: "Vui lòng kiểm tra email của bạn.",
      });
      onSuccessCallback(); // Chuyển sang giao diện nhập OTP
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        "Không tìm thấy người dùng hoặc lỗi server.";
      toast.error(msg);
    },
  });
};

// Hook Bước 2: Đổi mật khẩu
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi(payload),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!", {
        description: "Bạn có thể đăng nhập bằng mật khẩu mới.",
      });
      router.push("/login"); // Về trang login
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Mã OTP không hợp lệ hoặc hết hạn.";
      toast.error(msg);
    },
  });
};
