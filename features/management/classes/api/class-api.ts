import { axiosClient } from "@/lib/axios-client";
import { ClassResponse, CreateClassPayload, ClassFilters } from "../types";

// 1. GET: Lấy danh sách lớp học
export const getClassesApi = async (
  filters: ClassFilters,
): Promise<ClassResponse> => {
  const { data } = await axiosClient.get("/management/classes", {
    params: filters,
  });
  return data;
};

// 2. POST: Tạo lớp học mới
export const createClassApi = async (payload: CreateClassPayload) => {
  const { data } = await axiosClient.post("/management/classes", payload);
  return data;
};
