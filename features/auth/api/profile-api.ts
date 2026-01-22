import { axiosClient } from "@/lib/axios-client";
import { User } from "../types";

// Gọi API lấy thông tin profile
export const getProfileApi = async (): Promise<{ user: User }> => {
  const { data } = await axiosClient.get("/auth/me");
  return data;
};
