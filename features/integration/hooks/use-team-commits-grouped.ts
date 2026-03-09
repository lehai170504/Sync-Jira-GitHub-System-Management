import { useQuery } from "@tanstack/react-query";
import { getIntegrationTeamCommitsGroupedApi } from "../api/team-commits-api";

/**
 * Hook: GET /integrations/team/:teamId/commits (grouped members_commits)
 * Chỉ dùng cho LEADER khi xem "tất cả commit của team".
 */
export function useIntegrationTeamCommitsGrouped(
  teamId: string | undefined,
  enabled: boolean,
  branch?: string,
) {
  return useQuery({
    queryKey: ["integration-team-commits-grouped", teamId, branch],
    queryFn: () => getIntegrationTeamCommitsGroupedApi(teamId!, branch),
    enabled: enabled && !!teamId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

