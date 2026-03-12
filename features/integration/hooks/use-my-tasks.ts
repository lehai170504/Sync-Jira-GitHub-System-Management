import { useQuery } from "@tanstack/react-query";
import { getMyTasksListApi } from "../api/my-tasks-api";

/**
 * Hook để lấy danh sách tasks của user hiện tại (my-tasks)
 * GET /integrations/my-tasks
 * Chỉ dùng khi không phải Leader (Member xem board).
 */
export const useMyTasks = (enabled: boolean) => {
  return useQuery({
    queryKey: ["my-tasks"],
    queryFn: getMyTasksListApi,
    enabled,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};
