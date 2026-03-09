import { useQuery } from "@tanstack/react-query";
import { getTeamCommitsApi, getMemberCommitsApi } from "../api/team-commits-api";

/**
 * Hook để lấy danh sách commits của team
 * Chỉ gọi khi isLeader === true và authorFilter === "ALL"
 */
export const useTeamCommits = (
  teamId: string | undefined,
  enabled: boolean,
  branch?: string,
) => {
  return useQuery({
    queryKey: ["team-commits", teamId, branch],
    queryFn: () => getTeamCommitsApi(teamId!, branch),
    enabled: enabled && !!teamId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook để lấy danh sách commits của một thành viên cụ thể
 * Chỉ gọi khi isLeader === true và authorFilter !== "ALL"
 */
export const useMemberCommits = (
  teamId: string | undefined,
  memberId: string | undefined,
  enabled: boolean,
  branch?: string,
) => {
  return useQuery({
    queryKey: ["member-commits", teamId, memberId, branch],
    queryFn: () => getMemberCommitsApi(teamId!, memberId!, branch),
    enabled: enabled && !!teamId && !!memberId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

