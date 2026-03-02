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

/** Thứ tự status để sort tasks theo đúng vị trí cột Kanban (todo < in-progress < review < done) */
function getStatusOrder(
  statusCategory?: string,
  statusName?: string
): number {
  const cat = (statusCategory || "").toLowerCase().trim();
  const name = (statusName || "").toLowerCase().trim();
  const s = cat || name;
  if (s === "to do" || s === "todo" || s === "open" || s === "backlog" || s === "new") return 0;
  if (s === "in progress" || s === "in-progress" || s === "in development" || s === "development") return 1;
  if (s === "in review" || s === "review" || s === "code review" || s === "ready for review" || s === "in testing" || s === "testing") return 2;
  if (s === "done" || s === "closed" || s === "resolved") return 3;
  return 0;
}

/** Sắp xếp tasks theo status_name/status_category để hiển thị đúng vị trí trên Kanban */
export function sortTasksByStatus(tasks: TaskItem[]): TaskItem[] {
  return [...tasks].sort(
    (a, b) =>
      getStatusOrder(a.status_category, a.status_name) -
      getStatusOrder(b.status_category, b.status_name)
  );
}

/**
 * GET /tasks?team_id=...&sprint_id=...
 * Lấy danh sách tasks của team theo sprint (đã sort theo status)
 */
export const getTasksApi = async (
  teamId: string,
  sprintId: string
): Promise<TaskItem[]> => {
  const { data } = await axiosClient.get<TaskItem[]>("/tasks", {
    params: { team_id: teamId, sprint_id: sprintId },
  });
  return sortTasksByStatus(Array.isArray(data) ? data : []);
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
