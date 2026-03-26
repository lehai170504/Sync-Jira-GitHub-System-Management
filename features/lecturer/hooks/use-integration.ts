import { useQuery } from "@tanstack/react-query";
import { getTeamCommitsApi, getTeamTasksApi } from "../api/integration-api";

export const useTeamCommits = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-commits", teamId],
    queryFn: () => getTeamCommitsApi(teamId!),
    enabled: !!teamId,
  });
};

export const useTeamTasks = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-tasks", teamId],
    queryFn: () => getTeamTasksApi(teamId!),
    enabled: !!teamId,
  });
};
