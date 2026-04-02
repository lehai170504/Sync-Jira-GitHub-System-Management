import { axiosClient } from "@/lib/axios-client";
import {
  TeamDashboardResponse,
  TeamCommitsResponse,
  TeamRankingResponse,
  UpdateTeamConfigPayload,
  UpdateTeamConfigResponse,
} from "../types";

const num = (v: unknown, fallback: number): number =>
  typeof v === "number" && !Number.isNaN(v) ? v : fallback;

const strOrNull = (v: unknown): string | null =>
  typeof v === "string" ? v : v == null ? null : null;

/**
 * Chuẩn hóa payload GET /teams/:teamId/dashboard về đúng TeamDashboardResponse
 * (thiếu nhánh overview vẫn an toàn cho Tổng quan member).
 */
export function normalizeTeamDashboardResponse(
  raw: unknown,
): TeamDashboardResponse {
  const r = raw as Partial<TeamDashboardResponse> | null | undefined;
  const team = r?.team;
  const ov = r?.overview;
  const tasks = ov?.tasks;
  const commits = ov?.commits;
  const sprints = ov?.sprints;

  return {
    team: {
      _id: typeof team?._id === "string" ? team._id : "",
      project_name:
        typeof team?.project_name === "string" ? team.project_name : "",
      last_sync_at: strOrNull(team?.last_sync_at),
      jira_url: team?.jira_url,
      jira_project_key: team?.jira_project_key,
      jira_board_id: team?.jira_board_id,
      github_repo_url: team?.github_repo_url,
    },
    overview: {
      tasks: {
        total: num(tasks?.total, 0),
        done: num(tasks?.done, 0),
        todo: num(tasks?.todo, 0),
        done_percent: num(tasks?.done_percent, 0),
        story_point_total: num(tasks?.story_point_total, 0),
        story_point_done: num(tasks?.story_point_done, 0),
      },
      commits: {
        total: num(commits?.total, 0),
        counted: num(commits?.counted, 0),
        last_commit_date: strOrNull(commits?.last_commit_date),
      },
      sprints: {
        total: num(sprints?.total, 0),
        active: num(sprints?.active, 0),
      },
    },
  };
}

/**
 * GET /teams/:teamId/dashboard
 * Lấy dữ liệu Tổng quan cho dashboard (dùng cho cả LEADER và MEMBER).
 */
export const getTeamDashboardApi = async (
  teamId: string,
): Promise<TeamDashboardResponse> => {
  const { data } = await axiosClient.get<unknown>(
    `/teams/${teamId}/dashboard`,
  );
  return normalizeTeamDashboardResponse(data);
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
 * Mặc định BE trả 10. Truyền limit (1–100) để lấy thêm, ví dụ: ?limit=30
 */
export const getTeamCommitsFromTeamApi = async (
  teamId: string,
  branch?: string,
  limit?: number,
): Promise<TeamCommitsResponse> => {
  const params: Record<string, string | number> = {};
  if (branch) params.branch = branch;
  if (limit != null && limit > 0) params.limit = Math.min(100, limit);
  const { data } = await axiosClient.get<TeamCommitsResponse>(
    `/teams/${teamId}/commits`,
    { params: Object.keys(params).length ? params : undefined },
  );
  return data;
};

/**
 * GET /api/teams/:teamId/ranking
 * Bảng xếp hạng & summary nhóm (dashboard Thống kê cá nhân, /progress, contribution…)
 */
export const getTeamRankingApi = async (
  teamId: string,
): Promise<TeamRankingResponse> => {
  const { data } = await axiosClient.get<TeamRankingResponse>(
    `/api/teams/${teamId}/ranking`,
  );
  return data;
};

