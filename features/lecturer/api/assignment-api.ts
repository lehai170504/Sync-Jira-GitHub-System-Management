import { axiosClient } from "@/lib/axios-client";
import { Assignment, CreateAssignmentPayload } from "../types/assignment-types";

// POST: Tạo bài tập mới
export const createAssignmentApi = async (
  payload: CreateAssignmentPayload,
): Promise<void> => {
  await axiosClient.post("/academic/assignments", {
    ...payload,
    class_id: payload.classId,
  });
};

// GET: Lấy danh sách bài tập theo ClassId
export const getClassAssignmentsApi = async (
  classId: string,
  type?: string,
): Promise<Assignment[]> => {
  const url = `/academic/classes/${classId}/assignments`;
  const params = type && type !== "all" ? { type } : {};

  const { data } = await axiosClient.get(url, { params });
  return data;
};
