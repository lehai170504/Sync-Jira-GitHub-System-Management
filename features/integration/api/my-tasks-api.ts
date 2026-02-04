import { axiosClient } from "@/lib/axios-client";
import { TaskItem } from "@/features/management/teams/api/task-api";

/**
 * Response từ API GET /integrations/my-tasks
 */
export interface MyTasksResponse {
  project: {
    _id: string;
    name: string;
  };
  total: number;
  tasks: TaskItem[];
}

/**
 * GET /integrations/my-tasks
 * Lấy danh sách tasks của user hiện tại (dùng cho Member, không phải Leader)
 */
export const getMyTasksApi = async (): Promise<TaskItem[]> => {
  const { data } = await axiosClient.get<MyTasksResponse>("/integrations/my-tasks");
  return data.tasks;
};
