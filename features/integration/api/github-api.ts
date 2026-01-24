import { axiosClient } from "@/lib/axios-client";

export interface GithubRepo {
  id: number;
  name: string;
  url: string;
}

// 2. Interface cho Response bao bọc bên ngoài
interface GithubReposResponse {
  total: number;
  repos: GithubRepo[];
}

// --- GITHUB INTEGRATION ---

export const getGithubConnectUrlApi = async () => {
  const { data } = await axiosClient.get("/integrations/github/connect");

  return data.redirectUrl || data.url;
};

// Payload nhận từ GitHub Callback
export interface GithubCallbackPayload {
  code: string;
  state: string;
}

export const callbackGithubApi = async (params: GithubCallbackPayload) => {
  const { data } = await axiosClient.get("/integrations/github/callback", {
    params: {
      code: params.code,
      state: params.state,
    },
  });
  return data;
};

// Lấy danh sách Repo
export const getGithubReposApi = async (): Promise<GithubRepo[]> => {
  const { data } = await axiosClient.get<GithubReposResponse>(
    "/integrations/github/repos",
  );

  return data.repos;
};

export const disconnectGithubApi = async () => {
  const { data } = await axiosClient.delete("/integrations/github/disconnect");
  return data;
};
