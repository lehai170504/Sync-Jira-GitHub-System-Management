import { axiosClient } from "@/lib/axios-client";
import { User } from "../types";

export interface UpdateProfilePayload {
  full_name?: string;
  major?: string;
  ent?: string; // Khóa học (VD: K18)
  avatar_url?: string;
}

// Gọi API lấy thông tin profile
export const getProfileApi = async (): Promise<{ user: User }> => {
  const { data } = await axiosClient.get("/auth/me");
  return data;
};

// Gọi API cập nhật profile
export const updateProfileApi = async (data: UpdateProfilePayload) => {
  const { data: response } = await axiosClient.put("/auth/me", data);
  return response;
};
