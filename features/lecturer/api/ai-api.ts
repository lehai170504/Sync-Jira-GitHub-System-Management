import axios from "axios";
import { axiosClient } from "@/lib/axios-client";

// 1. API Chat cho Giảng viên (Tự gom context của cả Lớp)
export const sendClassChatApi = async (classId: string, message: string) => {
  const { data } = await axiosClient.post("/ai/project-chat", {
    classId,
    message,
  });
  // Giả định BE trả về object: { reply: "Nội dung markdown..." }
  return data;
};

/**
 * Xuất SRS theo **teamId** (cùng ngữ cảnh với GET /dashboard/teams/:teamId).
 * Ưu tiên route mới; nếu BE chưa deploy → fallback path cũ với cùng teamId (BE phải Team.findById).
 */
export const exportTeamSrsApi = async (teamId: string) => {
  const opts = { responseType: "blob" as const };
  try {
    const response = await axiosClient.get(
      `/ai/teams/${teamId}/export-srs`,
      opts,
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      const response = await axiosClient.get(
        `/ai/project/${teamId}/export-srs`,
        opts,
      );
      return response.data;
    }
    throw err;
  }
};

/** @deprecated Dùng exportTeamSrsApi — path cũ gửi projectId dễ lệch với teamId trên URL */
export const exportProjectSrsApi = async (projectId: string) => {
  const response = await axiosClient.get(`/ai/project/${projectId}/export-srs`, {
    responseType: "blob",
  });
  return response.data;
};
