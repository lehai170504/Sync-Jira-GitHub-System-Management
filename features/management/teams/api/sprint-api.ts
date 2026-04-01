import { axiosClient } from "@/lib/axios-client";

/**
 * Sprint item từ API GET /sprints/:teamId
 */
export interface SprintItem {
  _id: string;
  team_id: string;
  jira_sprint_id: number;
  name: string;
  state: string; // e.g. "active" | "closed" | "future"
  start_date: string; // ISO date
  end_date: string; // ISO date
  __v?: number;
}

/**
 * GET /sprints/:teamId
 * Lấy danh sách sprints của team
 */
export const getSprintsApi = async (
  teamId: string
): Promise<SprintItem[]> => {
  const { data } = await axiosClient.get<SprintItem[]>(`/sprints/${teamId}`);
  return data;
};

/**
 * Payload để tạo sprint mới
 */
export interface CreateSprintPayload {
  team_id: string;
  name: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
}

/**
 * Response khi tạo sprint thành công
 */
export interface CreateSprintResponse {
  message?: string;
  sprint?: {
    _id: string;
    name: string;
    start_date: string;
    end_date: string;
    state?: string;
  };
}

/**
 * POST /api/sprints
 * Tạo sprint mới cho team
 */
export const createSprintApi = async (
  payload: CreateSprintPayload,
): Promise<CreateSprintResponse> => {
  const { data } = await axiosClient.post<CreateSprintResponse>("/sprints", payload);
  return data;
};

/**
 * Payload để cập nhật sprint
 */
export interface UpdateSprintPayload {
  name: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
}

/**
 * PUT /sprints/:id
 * Cập nhật sprint theo id
 */
export const updateSprintApi = async (
  id: string,
  payload: UpdateSprintPayload,
): Promise<CreateSprintResponse> => {
  const { data } = await axiosClient.put<CreateSprintResponse>(`/sprints/${id}`, payload);
  return data;
};

/**
 * DELETE /sprints/:id
 * Xóa sprint theo id
 */
export const deleteSprintApi = async (id: string): Promise<{ message?: string }> => {
  const { data } = await axiosClient.delete<{ message?: string }>(`/sprints/${id}`);
  return data;
};

/**
 * Payload khi bắt đầu sprint (theo Swagger)
 */
export interface StartSprintPayload {
  start_date: string;
  end_date: string;
}

/**
 * POST /sprints/:id/start
 * Bắt đầu sprint — body lấy từ ngày đã lưu của sprint
 */
export const startSprintApi = async (
  sprintId: string,
  payload: StartSprintPayload,
): Promise<CreateSprintResponse> => {
  const { data } = await axiosClient.post<CreateSprintResponse>(
    `/sprints/${sprintId}/start`,
    payload,
  );
  return data;
};

