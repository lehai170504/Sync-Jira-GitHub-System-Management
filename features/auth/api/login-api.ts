// src/features/auth/api/login-api.ts
import { axiosClient } from "@/lib/axios-client"; // File bạn đã tạo trước đó
import { LoginResponse } from "../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginApi = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const { data } = await axiosClient.post("/auth/login", credentials);
  return data;
};
