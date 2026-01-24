import { axiosClient } from "@/lib/axios-client";
import { SubjectListResponse, CreateSubjectDto } from "../types";

const BASE_URL = "/management/subjects";

// 1. GET: Lấy danh sách môn học
// Param status: Active (theo hình image_5154fa.png)
export const getSubjectsApi = async (params?: { status?: string }) => {
  const { data } = await axiosClient.get<SubjectListResponse>(BASE_URL, {
    params,
  });
  return data;
};

// 2. POST: Tạo môn học mới (theo hình image_515518.png)
export const createSubjectApi = async (data: CreateSubjectDto) => {
  const { data: responseData } = await axiosClient.post(BASE_URL, data);
  return responseData;
};
