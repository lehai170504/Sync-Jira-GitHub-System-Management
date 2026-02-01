import { axiosClient } from "@/lib/axios-client";
import {
  TeamDashboardResponse,
  TeamCommitsResponse,
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
 * GET /api/teams/:teamId/jira-users
 * Lấy danh sách Jira users của team (dùng cho assignee khi tạo task)
 */
export interface JiraUserItem {
  jira_account_id: string;
  display_name?: string;
}

export interface JiraUsersResponse {
  total: number;
  users: JiraUserItem[];
}

export const getJiraUsersApi = async (
  teamId: string,
): Promise<JiraUsersResponse> => {
  const { data } = await axiosClient.get<JiraUsersResponse>(
    `/teams/${teamId}/jira-users`,
  );
  return data;
};

/**
 * GET /api/teams/:teamId/commits
 * Lấy danh sách commits của team (khi filter "Tất cả thành viên" ở /commits)
 */
export const getTeamCommitsFromTeamApi = async (
  teamId: string,
): Promise<TeamCommitsResponse> => {
  const { data } = await axiosClient.get<TeamCommitsResponse>(
    `/teams/${teamId}/commits`,
  );
  return data;
};

