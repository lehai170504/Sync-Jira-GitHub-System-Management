import { axiosClient } from "@/lib/axios-client";
import {
  TeamDashboardResponse,
  TeamSprintsResponse,
  UpdateTeamConfigPayload,
  UpdateTeamConfigResponse,
} from "../types";

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

/**
 * PUT /api/teams/:teamId/config
 * Cập nhật cấu hình tích hợp cho team (chỉ dành cho Leader)
 */
export const updateTeamConfigApi = async (
  teamId: string,
  payload: UpdateTeamConfigPayload,
): Promise<UpdateTeamConfigResponse> => {
  const { data } = await axiosClient.put<UpdateTeamConfigResponse>(
    `/teams/${teamId}/config`,
    payload,
  );
  return data;
};

/**
 * GET /api/teams/:teamId/sprints
 * Lấy danh sách sprints của team từ Jira
 */
export const getTeamSprintsApi = async (teamId: string): Promise<TeamSprintsResponse> => {
  const { data } = await axiosClient.get<TeamSprintsResponse>(
    `/teams/${teamId}/sprints`,
  );
  return data;
};

