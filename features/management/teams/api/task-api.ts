import { axiosClient } from "@/lib/axios-client";

/**
 * Task item từ API GET /tasks?team_id=...&sprint_id=...
 */
export interface TaskItem {
  _id: string;
  team_id: string;
  sprint_id: string;
  issue_id?: string;
  issue_key: string;
  summary: string;
  description?: string;
  status_name?: string;
  status_category: string;
  story_point?: number;
  assignee_account_id?: string | null;
  reporter_account_id?: string | null;
  start_date?: string;
  due_date?: string;
  updated_at?: string;
  __v?: number;
}

/**
 * GET /tasks?team_id=...&sprint_id=...
 * Lấy danh sách tasks của team theo sprint
 */
export const getTasksApi = async (
  teamId: string,
  sprintId: string
): Promise<TaskItem[]> => {
  const { data } = await axiosClient.get<TaskItem[]>("/tasks", {
    params: { team_id: teamId, sprint_id: sprintId },
  });
  return data;
};

/**
 * Payload để tạo task mới
 * POST /api/tasks
 */
export interface CreateTaskPayload {
  team_id: string;
  summary: string;
  description: string;
  assignee_account_id: string;
  story_point: number;
  start_date: string; // yyyy-MM-dd
  due_date: string; // yyyy-MM-dd
  sprint_id: string;
}

/**
 * Response khi tạo task thành công
 */
export interface CreateTaskResponse {
  message?: string;
  task?: {
    _id?: string;
    issue_key?: string;
    summary?: string;
    [key: string]: unknown;
  };
}

/**
 * POST /api/tasks
 * Tạo task mới cho team
 */
export const createTaskApi = async (
  payload: CreateTaskPayload
): Promise<CreateTaskResponse> => {
  const { data } = await axiosClient.post<CreateTaskResponse>("/tasks", payload);
  return data;
};

/**
 * Payload để cập nhật task
 * PUT /tasks/:id
 *
 * API BE KHÔNG bắt buộc phải gửi đầy đủ tất cả field,
 * nhưng field team_id là BẮT BUỘC.
 * Các field còn lại có thể gửi partial; BE sẽ chỉ cập nhật
 * những field được gửi lên, các field khác giữ nguyên.
 */
export interface UpdateTaskPayload {
  team_id: string;
  summary?: string;
  description?: string;
  status?: string;
  sprint_id?: string;
  assignee_account_id?: string;
  story_point?: number;
  start_date?: string; // yyyy-MM-dd
  due_date?: string; // yyyy-MM-dd
  reporter_account_id?: string;
}

/**
 * Response khi cập nhật task thành công
 */
export interface UpdateTaskResponse {
  message?: string;
  task?: {
    _id?: string;
    issue_key?: string;
    summary?: string;
    [key: string]: unknown;
  };
}

/**
 * PUT /api/tasks/:id
 * Cập nhật task
 */
export const updateTaskApi = async (
  taskId: string,
  payload: UpdateTaskPayload
): Promise<UpdateTaskResponse> => {
  const { data } = await axiosClient.put<UpdateTaskResponse>(
    `/tasks/${taskId}`,
    payload
  );
  return data;
};

/**
 * Response khi xóa task thành công
 */
export interface DeleteTaskResponse {
  message?: string;
}

/**
 * DELETE /api/tasks/:id
 * Xóa task
 */
export const deleteTaskApi = async (
  taskId: string
): Promise<DeleteTaskResponse> => {
  const { data } = await axiosClient.delete<DeleteTaskResponse>(
    `/tasks/${taskId}`
  );
  return data;
};
