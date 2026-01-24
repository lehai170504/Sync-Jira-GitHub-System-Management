import { axiosClient } from "@/lib/axios-client";

// --- TYPES ---
export interface RequestOtpPayload {
  email: string;
}

export interface RegisterPayload {
  email: string;
  otp_code: string;
  full_name: string;
  password: string;
  role: "STUDENT" | "LECTURER";
  avatar_url?: string;
  student_code: string;
}

export interface RegisterResponse {
  message: string;
  user?: any;
}

// --- API FUNCTIONS ---

// Bước 1: Yêu cầu OTP
export const requestOtpApi = async (payload: RequestOtpPayload) => {
  const { data } = await axiosClient.post(
    "/auth/request-registration-otp",
    payload,
  );
  return data;
};

// Bước 2: Submit thông tin đăng ký
export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await axiosClient.post("/auth/register", payload);
  return data;
};
