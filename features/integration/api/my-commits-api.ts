import { axiosClient } from "@/lib/axios-client";
import { MyCommitsResponse } from "../types";

/**
 * GET /api/integrations/my-commits
 * Lấy danh sách commits của bản thân user đang đăng nhập
 * @param branch - Lọc theo nhánh (optional). Không truyền thì trả tất cả.
 */
export const getMyCommitsApi = async (
  branch?: string,
): Promise<MyCommitsResponse> => {
  const params = branch ? { branch } : {};
  const { data } = await axiosClient.get<MyCommitsResponse>(
    "/integrations/my-commits",
    { params },
  );
  return data;
};

