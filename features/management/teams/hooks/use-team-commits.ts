import { useQuery } from "@tanstack/react-query";
import { getTeamCommitsFromTeamApi } from "../api/team-api";

/**
 * Hook để lấy commits của team theo endpoint /teams/:teamId/commits
 * Dùng cho /commits khi filter "Tất cả thành viên".
 */
export const useTeamCommitsFromTeam = (
  teamId: string | undefined,
  enabled: boolean,
  branch?: string,
) => {
  return useQuery({
    queryKey: ["team-commits-by-team", teamId, branch],
    queryFn: () => getTeamCommitsFromTeamApi(teamId!, branch),
    enabled: enabled && !!teamId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};

