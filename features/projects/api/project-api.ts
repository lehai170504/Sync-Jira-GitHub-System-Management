import { axiosClient } from "@/lib/axios-client";
import {
  ClassProjectsResponse,
  CreateProjectPayload,
  CreateProjectResponse,
  MyProjectResponse,
  ProjectDetail,
  ProjectManagement,
  ProjectsApiResponse,
  TeamConfigPayload,
  TeamConfigResponse,
} from "../types/types";
import { TeamDetailResponse } from "@/features/student/types/team-types";

// POST /api/projects: Leader tạo Project mới cho nhóm
export const createProjectApi = async (
  payload: CreateProjectPayload,
): Promise<CreateProjectResponse> => {
  const { data } = await axiosClient.post<CreateProjectResponse>(
    "/projects",
    payload,
  );
  return data;
};

export const getMyProjectApi = async (): Promise<ProjectDetail> => {
  const { data } = await axiosClient.get<MyProjectResponse>(
    "/projects/my-project",
  );
  return data.project;
};

export const getLecturerProjectsApi = async (
  classId: string,
): Promise<ProjectManagement[]> => {
  const { data } = await axiosClient.get<ProjectsApiResponse>(
    `/projects/lecturer/classes/${classId}`,
  );

  return data.projects || [];
};

export const updateTeamConfigApi = async (
  teamId: string,
  payload: TeamConfigPayload,
): Promise<TeamConfigResponse> => {
  const { data } = await axiosClient.put(`/teams/${teamId}/config`, payload);
  return data;
};

export const getClassProjectsApi = async (
  classId: string,
): Promise<ClassProjectsResponse> => {
  const { data } = await axiosClient.get(`/projects/classes/${classId}`);
  return data;
};

export const getTeamProjectDetail = async (
  teamId: string,
): Promise<TeamDetailResponse> => {
  const { data } = await axiosClient.get(`/projects/teams/${teamId}`);
  return data;
};
