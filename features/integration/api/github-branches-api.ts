import { axiosClient } from "@/lib/axios-client";

export interface GithubBranchesResponse {
  branches: string[];
}

export async function getProjectGithubBranchesApi(
  projectId: string,
): Promise<GithubBranchesResponse> {
  const { data } = await axiosClient.get<GithubBranchesResponse>(
    `/integrations/projects/${projectId}/github-branches`,
  );
  return data;
}

