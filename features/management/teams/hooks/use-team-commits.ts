import { useQuery } from "@tanstack/react-query";
import { getTeamCommitsFromTeamApi } from "../api/team-api";

/**
 * Hook để lấy commits của team theo endpoint /teams/:teamId/commits
 * Dùng cho /commits khi filter "Tất cả thành viên".
 * Mặc định BE trả 10. Truyền limit để lấy thêm (tối đa 100).
 */
export const useTeamCommitsFromTeam = (
  teamId: string | undefined,
  enabled: boolean,
  branch?: string,
  limit?: number,
) => {
  return useQuery({
    queryKey: ["team-commits-by-team", teamId, branch, limit],
    queryFn: () => getTeamCommitsFromTeamApi(teamId!, branch, limit),
    enabled: enabled && !!teamId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};

