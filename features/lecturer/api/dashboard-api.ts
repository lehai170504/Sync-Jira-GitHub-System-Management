import { axiosClient } from "@/lib/axios-client";
import { TeamDashboardResponse } from "../types/dashboard-types";

// Lấy toàn bộ data Dashboard của lớp học
export const getClassDashboardApi = async (classId: string) => {
  const { data } = await axiosClient.get(`/dashboard/classes/${classId}`);
  return data;
};
export const getTeamDashboardApi = async (
  teamId: string
): Promise<TeamDashboardResponse> => {
  const { data } = await axiosClient.get(`/dashboard/teams/${teamId}`);
  return data;
};
