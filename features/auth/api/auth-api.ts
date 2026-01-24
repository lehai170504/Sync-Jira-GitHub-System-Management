import { axiosClient } from "@/lib/axios-client";

const ROOT_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "";

// --- GOOGLE OAUTH ---

// 1. Lấy URL đăng nhập Google (Sửa lại dùng Axios)
export const getGoogleAuthUrlApi = async (redirectUri: string) => {
  const { data } = await axiosClient.get(`${ROOT_URL}/auth/google`, {
    params: {
      redirect_uri: redirectUri,
    },
  });

  return data.redirectUrl;
};

// 2. Callback xử lý
export interface GoogleCallbackParams {
  code: string;
  error?: string;
  state?: string;
}

export const googleCallbackApi = async (params: GoogleCallbackParams) => {
  const { data } = await axiosClient.get(`${ROOT_URL}/auth/google/callback`, {
    params: {
      code: params.code,
      error: params.error,
      state: params.state,
    },
  });
  return data;
};
