import { useQuery } from "@tanstack/react-query";
import { getTeamAllTasksApi } from "../api/team-all-tasks-api";

/**
 * Hook để lấy danh sách tasks của tất cả thành viên trong team, được group theo member
 * GET /integrations/team/{teamId}/tasks
 */
export const useTeamAllTasks = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-all-tasks", teamId],
    queryFn: () => getTeamAllTasksApi(teamId!),
    enabled: !!teamId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};
