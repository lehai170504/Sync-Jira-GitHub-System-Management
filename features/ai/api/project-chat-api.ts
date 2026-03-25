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
  const { data } = await axiosClient.post<ProjectChatResponse>(
    "/ai/project-chat",
    payload,
  );
  return data;
}

