import { axiosClient } from "@/lib/axios-client";

/**
 * GET /api/integrations/team/:teamId/commits
 * Lấy danh sách commits của team (cho LEADER khi filter "Tất cả thành viên")
 */
export interface TeamCommitItem {
  _id: string;
  message: string;
  author: string;
  branch: string;
  branches?: string[];
  date: string; // ISO date
  sha?: string;
  url?: string;
  additions?: number;
  deletions?: number;
}

export interface TeamCommitsResponse {
  project: {
    _id: string;
    name: string;
  };
  total: number;
  commits: TeamCommitItem[];
}

export const getTeamCommitsApi = async (
  teamId: string,
  branch?: string,
): Promise<TeamCommitsResponse> => {
  const params = branch ? { branch } : {};
  const { data } = await axiosClient.get<TeamCommitsResponse>(
    `/integrations/team/${teamId}/commits`,
    { params },
  );
  return data;
};

/**
 * GET /api/integrations/team/:teamId/member/:memberId/commits
 * Lấy danh sách commits của một thành viên cụ thể trong team
 */
export interface MemberCommitsResponse {
  member: {
    _id: string;
    student: {
      _id: string;
      full_name: string;
    };
  };
  total: number;
  commits: TeamCommitItem[];
}

export const getMemberCommitsApi = async (
  teamId: string,
  memberId: string,
  branch?: string,
): Promise<MemberCommitsResponse> => {
  const params = branch ? { branch } : {};
  const { data } = await axiosClient.get<MemberCommitsResponse>(
    `/integrations/team/${teamId}/member/${memberId}/commits`,
    { params },
  );
  return data;
};

/**
 * GET /integrations/team/:teamId/commits
 * (Grouped) Lấy commits của toàn team, group theo từng member.
 * Dùng cho UI Leader "xem tất cả commit của team".
 *
 * NOTE: Endpoint này khác shape với `TeamCommitsResponse` (flat list).
 */
export interface IntegrationTeamCommitsGroupedResponse {
  team: {
    _id: string;
    project_name: string;
  };
  summary: {
    total_members: number;
    total_commits: number;
  };
  members_commits: Array<{
    member: {
      _id: string;
      student: {
        _id: string;
        student_code: string;
        email: string;
        full_name: string;
      } | null;
      role_in_team: string;
      github_username: string | null;
    };
    total: number;
    commits: Array<{
      _id: string;
      team_id: string;
      hash: string;
      author_email: string;
      commit_date: string;
      is_counted: boolean;
      message: string;
      rejection_reason?: string | null;
      branches?: string[];
      __v?: number;
    }>;
  }>;
}

export async function getIntegrationTeamCommitsGroupedApi(
  teamId: string,
  branch?: string,
): Promise<IntegrationTeamCommitsGroupedResponse> {
  const params = branch ? { branch } : {};
  const { data } = await axiosClient.get<IntegrationTeamCommitsGroupedResponse>(
    `/integrations/team/${teamId}/commits`,
    { params },
  );
  return data;
}

