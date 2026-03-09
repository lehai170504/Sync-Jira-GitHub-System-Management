import { axiosClient } from "@/lib/axios-client";

export interface CreateRepoPayload {
  repoName: string;
  description?: string;
  isPrivate?: boolean;
  projectId?: string;
  gitIgnoreTemplate?: string;
}

export interface CreateRepoResponse {
  message?: string;
  repoUrl?: string;
}

/**
 * POST /api/integrations/github/create-repo
 * Tự động tạo GitHub Repository (Auto-Provisioning)
 * Bước 1: KHÔNG truyền projectId - BE tạo repo trên GitHub, trả về repoUrl
 */
export const createGithubRepoApi = async (
  payload: Omit<CreateRepoPayload, "projectId">,
): Promise<CreateRepoResponse> => {
  const { data } = await axiosClient.post<CreateRepoResponse>(
    "/integrations/github/create-repo",
    payload,
  );
  return data;
};
