"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyTasksApi } from "../api/my-tasks-api";

/**
 * Hook: GET /integrations/my-tasks (full response)
 * Dùng cho màn hình Profile để vẽ "Lịch sử đóng góp".
 */
export function useMyTasksResponse(enabled: boolean) {
  return useQuery({
    queryKey: ["my-tasks-response"],
    queryFn: getMyTasksApi,
    enabled,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
}

