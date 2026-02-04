import { useQuery } from "@tanstack/react-query";
import { getMemberTasksApi } from "../api/member-tasks-api";

/**
 * Hook để lấy danh sách tasks của một thành viên cụ thể trong team
 * GET /integrations/team/{teamId}/member/{memberId}/tasks
 */
export const useMemberTasks = (
  teamId: string | undefined,
  memberId: string | undefined
) => {
  return useQuery({
    queryKey: ["member-tasks", teamId, memberId],
    queryFn: () => getMemberTasksApi(teamId!, memberId!),
    enabled: !!teamId && !!memberId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};
