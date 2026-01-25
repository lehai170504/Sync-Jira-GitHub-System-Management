import { axiosClient } from "@/lib/axios-client";
import {
  GradingConfigPayload,
  GradingConfigResponse,
} from "../types/grading-types";

// PUT: Cập nhật cấu hình điểm
export const updateGradingConfigApi = async (
  classId: string,
  payload: GradingConfigPayload,
): Promise<GradingConfigResponse> => {
  const { data } = await axiosClient.put(
    `/management/classes/${classId}/grading-config`,
    payload,
  );
  return data;
};
