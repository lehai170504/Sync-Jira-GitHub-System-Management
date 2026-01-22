import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  requestOtpApi,
  registerApi,
  RequestOtpPayload,
  RegisterPayload,
} from "../api/register-api";

// Hook cho Bước 1: Xin OTP
export const useRequestOtp = (onSuccessCallback: () => void) => {
  return useMutation({
    mutationFn: (payload: RequestOtpPayload) => requestOtpApi(payload),
    onSuccess: (data) => {
      toast.success("Mã OTP đã được gửi!", {
        description: "Vui lòng kiểm tra email của bạn (bao gồm cả mục Spam).",
      });
      onSuccessCallback(); // Chuyển sang bước 2
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại.";
      toast.error(msg);
    },
  });
};

// Hook cho Bước 2: Đăng ký
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: () => {
      toast.success("Đăng ký tài khoản thành công!", {
        description: "Bạn có thể đăng nhập ngay bây giờ.",
      });
      router.push("/login"); // Chuyển về trang login
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        "Đăng ký thất bại. Kiểm tra lại OTP hoặc thông tin.";
      toast.error(msg);
    },
  });
};
