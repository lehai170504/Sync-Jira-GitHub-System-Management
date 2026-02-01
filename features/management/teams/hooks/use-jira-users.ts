import { useQuery } from "@tanstack/react-query";
import { getJiraUsersApi } from "../api/team-api";

/**
 * Hook để lấy danh sách Jira users của team
 * GET /teams/:teamId/jira-users
 * Dùng cho assignee dropdown khi tạo task
 */
export const useJiraUsers = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["jira-users", teamId],
    queryFn: () => getJiraUsersApi(teamId!),
    enabled: !!teamId,
    staleTime: 60 * 1000,
  });
};
