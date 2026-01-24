import { axiosClient } from "@/lib/axios-client";

export interface JiraProject {
  id: string;
  key: string; // VD: "PROJ"
  name: string; // VD: "My Project Name"
}

interface JiraProjectsResponse {
  total: number;
  projects: JiraProject[];
}

// --- JIRA INTEGRATION ---

// 1. Lấy URL kết nối
export const getJiraConnectUrlApi = async () => {
  const { data } = await axiosClient.get("/integrations/jira/connect");
  return data.redirectUrl || data.url;
};

// Payload Callback
export interface JiraCallbackPayload {
  code: string;
  state: string;
}

// 2. Gửi Callback về Backend
export const callbackJiraApi = async (params: JiraCallbackPayload) => {
  const { data } = await axiosClient.get("/integrations/jira/callback", {
    params: {
      code: params.code,
      state: params.state,
    },
  });
  return data;
};

export const getJiraProjectsApi = async (): Promise<JiraProject[]> => {
  const { data } = await axiosClient.get<JiraProjectsResponse>(
    "/integrations/jira/projects",
  );
  return data.projects;
};

export const disconnectJiraApi = async () => {
  const { data } = await axiosClient.delete("/integrations/jira/disconnect");
  return data;
};
