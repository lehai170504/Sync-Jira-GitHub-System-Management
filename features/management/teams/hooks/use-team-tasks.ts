import { useQuery } from "@tanstack/react-query";
import { getTasksApi } from "../api/task-api";

/**
 * Hook để lấy danh sách tasks của team theo sprint
 * GET /tasks?team_id=...&sprint_id=...
 */
export const useTeamTasks = (teamId: string | undefined, sprintId: string | undefined) => {
  return useQuery({
    queryKey: ["team-tasks", teamId, sprintId],
    queryFn: () => getTasksApi(teamId!, sprintId!),
    enabled: !!teamId && !!sprintId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};

