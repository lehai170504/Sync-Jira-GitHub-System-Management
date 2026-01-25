import { axiosClient } from "@/lib/axios-client";
import { MyClassesResponse } from "../types/my-class-types";

// API: Lấy danh sách lớp của chính sinh viên đang đăng nhập
export const getMyClassesApi = async (): Promise<MyClassesResponse> => {
  const { data } = await axiosClient.get<MyClassesResponse>("/auth/me/classes");
  return data;
};
