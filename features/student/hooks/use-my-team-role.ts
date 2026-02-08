// features/student/hooks/use-my-team-role.ts
import { useQuery } from "@tanstack/react-query";
import { getMyTeamRoleApi } from "../api/team-api";

export const useMyTeamRole = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["my-team-role", teamId],
    queryFn: () => getMyTeamRoleApi(teamId!),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
