import { axiosClient } from "@/lib/axios-client";

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

