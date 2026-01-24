import { axiosClient } from "@/lib/axios-client";

export const logoutApi = async (refreshToken: string) => {
  // Gửi refresh_token lên để server revoke (thu hồi)
  return await axiosClient.post("/auth/logout", {
    refresh_token: refreshToken,
  });
};
