import { useQuery } from "@tanstack/react-query";
import { getSprintsApi } from "../api/sprint-api";

/**
 * Hook để lấy danh sách sprints của team
 * GET /sprints/:teamId
 */
export const useTeamSprints = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-sprints", teamId],
    queryFn: () => getSprintsApi(teamId!),
    enabled: !!teamId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};


