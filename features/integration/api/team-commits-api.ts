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
): Promise<TeamCommitsResponse> => {
  const { data } = await axiosClient.get<TeamCommitsResponse>(
    `/integrations/team/${teamId}/commits`,
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
): Promise<MemberCommitsResponse> => {
  const { data } = await axiosClient.get<MemberCommitsResponse>(
    `/integrations/team/${teamId}/member/${memberId}/commits`,
  );
  return data;
};

