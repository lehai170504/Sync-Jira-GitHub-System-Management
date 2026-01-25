import { axiosClient } from "@/lib/axios-client";
import {
  CreateProjectPayload,
  CreateProjectResponse,
  MyProjectResponse,
  ProjectDetail,
  ProjectManagement,
  ProjectsApiResponse,
} from "../types";

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
