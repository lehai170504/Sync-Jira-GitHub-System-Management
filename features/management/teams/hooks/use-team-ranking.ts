import { useQuery } from "@tanstack/react-query";
import { getTeamRankingApi } from "../api/team-api";

/**
 * Hook để lấy bảng xếp hạng đóng góp của các thành viên trong team
 * GET /teams/:teamId/ranking
 */
export const useTeamRanking = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-ranking", teamId],
    queryFn: () => {
      if (!teamId) {
        throw new Error("Team ID is required");
      }
      return getTeamRankingApi(teamId);
    },
    enabled: !!teamId,
    staleTime: 30 * 1000, // 30 giây
    refetchOnWindowFocus: true,
  });
};
