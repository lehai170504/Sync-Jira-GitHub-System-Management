import { useQuery } from "@tanstack/react-query";
import { getTeamCommitsApi, getMemberCommitsApi } from "../api/team-commits-api";

/**
 * Hook để lấy danh sách commits của team
 * Chỉ gọi khi isLeader === true và authorFilter === "ALL"
 */
export const useTeamCommits = (teamId: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["team-commits", teamId],
    queryFn: () => getTeamCommitsApi(teamId!),
    enabled: enabled && !!teamId, // Chỉ chạy khi enabled và có teamId
    staleTime: 30 * 1000, // Cache 30 giây
    refetchOnWindowFocus: true, // Tự động refetch khi focus lại cửa sổ
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
) => {
  return useQuery({
    queryKey: ["member-commits", teamId, memberId],
    queryFn: () => getMemberCommitsApi(teamId!, memberId!),
    enabled: enabled && !!teamId && !!memberId, // Chỉ chạy khi enabled và có teamId, memberId
    staleTime: 30 * 1000, // Cache 30 giây
    refetchOnWindowFocus: true, // Tự động refetch khi focus lại cửa sổ
  });
};

