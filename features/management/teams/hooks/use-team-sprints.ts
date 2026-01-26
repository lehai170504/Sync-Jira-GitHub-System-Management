import { useQuery } from "@tanstack/react-query";
import { getTeamSprintsApi } from "../api/team-api";

/**
 * Hook để lấy danh sách sprints của team từ Jira
 * GET /teams/:teamId/sprints
 */
export const useTeamSprints = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-sprints", teamId],
    queryFn: () => getTeamSprintsApi(teamId!),
    enabled: !!teamId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};


