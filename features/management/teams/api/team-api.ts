import { axiosClient } from "@/lib/axios-client";
import { TeamDashboardResponse } from "../types";

/**
 * GET /api/teams/:teamId/dashboard
 * Lấy dữ liệu dashboard cho student (team overview)
 */
export const getTeamDashboardApi = async (
  teamId: string,
): Promise<TeamDashboardResponse> => {
  const { data } = await axiosClient.get<TeamDashboardResponse>(
    `/teams/${teamId}/dashboard`,
  );
  return data;
};

