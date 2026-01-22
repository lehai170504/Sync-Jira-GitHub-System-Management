import { axiosClient } from "@/lib/axios-client";

// --- TYPES ---
export interface RequestResetOtpPayload {
  email: string;
  role: "STUDENT" | "LECTURER";
}

export interface ResetPasswordPayload {
  email: string;
  otp_code: string;
  new_password: string;
  confirm_password: string;
}

// --- API FUNCTIONS ---

// Bước 1: Yêu cầu gửi OTP quên mật khẩu
export const requestResetOtpApi = async (payload: RequestResetOtpPayload) => {
  const { data } = await axiosClient.post("/auth/forgot-password", payload);
  return data;
};

// Bước 2: Xác thực OTP và đặt lại mật khẩu
export const resetPasswordApi = async (payload: ResetPasswordPayload) => {
  const { data } = await axiosClient.post(
    "/auth/verify-otp-reset-password",
    payload,
  );
  return data;
};
