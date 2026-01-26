import { axiosClient } from "@/lib/axios-client";
import { MyCommitsResponse } from "../types";

/**
 * GET /api/integrations/my-commits
 * Lấy danh sách commits của bản thân user đang đăng nhập
 */
export const getMyCommitsApi = async (): Promise<MyCommitsResponse> => {
  const { data } = await axiosClient.get<MyCommitsResponse>(
    "/integrations/my-commits",
  );
  return data;
};

