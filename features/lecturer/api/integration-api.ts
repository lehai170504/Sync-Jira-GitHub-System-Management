import { axiosClient } from "@/lib/axios-client";

// 1. Lấy danh sách Commits của cả Team
export const getTeamCommitsApi = async (
  teamId: string,
  limit: number = 100
) => {
  const { data } = await axiosClient.get(
    `/integrations/team/${teamId}/commits`,
    {
      params: { limit },
    }
  );
  return data;
};

// 2. Lấy danh sách Tasks (Jira) của cả Team
export const getTeamTasksApi = async (teamId: string, limit: number = 100) => {
  const { data } = await axiosClient.get(`/integrations/team/${teamId}/tasks`, {
    params: { limit },
  });
  return data;
};
