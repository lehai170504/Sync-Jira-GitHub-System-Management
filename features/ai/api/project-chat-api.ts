import { axiosClient } from "@/lib/axios-client";

export type ProjectChatRequest = {
  classId: string;
  message: string;
};

export type ProjectChatResponse = {
  reply?: string;
  message?: string;
  data?: {
    reply?: string;
  };
  [key: string]: unknown;
};

export async function postProjectChatApi(
  payload: ProjectChatRequest,
): Promise<ProjectChatResponse> {
  // BE chốt endpoint: POST /ai/project-chat.
  // Lưu ý: một số môi trường cấu hình baseURL đã chứa "/api" (vd: https://host/api),
  // nên tuyệt đối tránh gọi "/api/..." trực tiếp vì sẽ thành "/api/api/...".
  const baseUrl = String(axiosClient.defaults.baseURL ?? "");
  const baseEndsWithApi = /\/api\/?$/i.test(baseUrl);

  const primaryPath = "/ai/project-chat";
  const fallbackPath = baseEndsWithApi ? null : "/api/ai/project-chat";

  try {
    const { data } = await axiosClient.post<ProjectChatResponse>(primaryPath, payload);
    return data;
  } catch (e: any) {
    if (!fallbackPath) throw e;
    const status = e?.response?.status;
    if (status !== 404 && !(typeof status === "number" && status >= 500)) throw e;
    const { data } = await axiosClient.post<ProjectChatResponse>(fallbackPath, payload);
    return data;
  }
}

