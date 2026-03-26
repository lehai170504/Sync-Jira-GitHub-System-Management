import { axiosClient } from "@/lib/axios-client";
import { sortTasksByStatus } from "@/features/management/teams/api/task-api";
import type { IntegrationProjectRef } from "../types";

/**
 * Response từ API GET /integrations/my-tasks
 */
export interface MyTasksResponse {
  projects: IntegrationProjectRef[];
  total: number;
  tasks: Array<{
    _id: string;
    team_id: string;
    issue_id?: string;
    issue_key: string;
    summary: string;
    description?: string;
    status_category: string;
    status_name?: string;
    story_point?: number;
    assignee_account_id?: string | null;
    assignee_id?: string | null;
    assignee_name?: string;
    reporter_account_id?: string | null;
    reporter_name?: string;
    sprint_id:
      | string
      | {
          _id: string;
          name: string;
          state?: string;
        };
    start_date?: string;
    due_date?: string;
    updated_at?: string;
    __v?: number;
  }>;
}

/**
 * GET /integrations/my-tasks
 * Lấy danh sách tasks của user hiện tại (dùng cho Member, không phải Leader)
 */
export const getMyTasksApi = async (): Promise<MyTasksResponse> => {
  const { data } = await axiosClient.get<MyTasksResponse>(
    "/integrations/my-tasks",
  );
  const tasks = Array.isArray(data.tasks) ? data.tasks : [];
  return {
    projects: Array.isArray(data.projects) ? data.projects : [],
    total: Number(data.total ?? tasks.length) || 0,
    tasks: sortTasksByStatus(tasks as any),
  };
};

/**
 * Backward-compatible helper: chỉ lấy mảng tasks (đã sort)
 * Dùng cho các màn hình cũ.
 */
export const getMyTasksListApi = async () => {
  const data = await getMyTasksApi();
  return data.tasks;
};
