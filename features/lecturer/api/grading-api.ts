import { axiosClient } from "@/lib/axios-client";
import {
  GradingConfigPayload,
  GradingConfigResponse,
} from "../types/grading-types";

// PUT: Cập nhật cấu hình điểm
export const updateGradingConfigApi = async (
  classId: string,
  payload: GradingConfigPayload
): Promise<GradingConfigResponse> => {
  // Sửa lại endpoint cho chuẩn với tài liệu Backend
  const { data } = await axiosClient.put(
    `/academic/classes/${classId}/contribution-config`,
    payload
  );
  return data;
};
