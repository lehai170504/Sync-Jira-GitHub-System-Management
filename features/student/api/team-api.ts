import { axiosClient } from "@/lib/axios-client";
import {
  ClassTeamsResponse,
  MyTeamRoleResponse,
  TeamDetailResponse,
} from "../types/team-types";

// API lấy danh sách nhóm trong lớp
export const getClassTeamsApi = async (
  classId: string,
): Promise<ClassTeamsResponse> => {
  const { data } = await axiosClient.get("/teams", {
    params: { class_id: classId },
  });
  return data;
};

export const getTeamDetailApi = async (
  teamId: string,
): Promise<TeamDetailResponse> => {
  const { data } = await axiosClient.get(`/teams/${teamId}`);
  return data;
};

export const getMyTeamRoleApi = async (
  teamId: string,
): Promise<MyTeamRoleResponse> => {
  const { data } = await axiosClient.get(`/api/teams/${teamId}/my-role`);
  return data;
};
