import { axiosClient } from "@/lib/axios-client";
import { UserResponse, UserFilters, CreateUserPayload } from "../types";

// 1. GET: Lấy danh sách users
export const getUsersApi = async (
  filters: UserFilters,
): Promise<UserResponse> => {
  const { data } = await axiosClient.get("/management/users", {
    params: filters,
  });
  return data;
};

// 2. POST: Tạo user mới
export const createUserApi = async (payload: CreateUserPayload) => {
  const { data } = await axiosClient.post("/management/users", payload);
  return data;
};
