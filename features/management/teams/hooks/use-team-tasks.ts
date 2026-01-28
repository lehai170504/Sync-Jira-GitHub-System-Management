import { useQuery } from "@tanstack/react-query";
import { getTeamTasksApi } from "../api/team-api";

/**
 * Hook để lấy danh sách tasks của team theo sprint từ Jira
 * GET /teams/:teamId/tasks?sprintId=...
 */
export const useTeamTasks = (teamId: string | undefined, sprintId: string | undefined) => {
  return useQuery({
    queryKey: ["team-tasks", teamId, sprintId],
    queryFn: () => getTeamTasksApi(teamId!, sprintId!),
    enabled: !!teamId && !!sprintId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};

