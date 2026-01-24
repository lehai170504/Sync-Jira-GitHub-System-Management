import { axiosClient } from "@/lib/axios-client";
import {
  ClassResponse,
  CreateClassPayload,
  ClassFilters,
  ImportStudentsPayload,
  ClassStudentsResponse,
  AddStudentPayload,
  RemoveStudentsPayload,
  UpdateStudentsPayload,
} from "../types";

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

export const getClassStudentsApi = async (
  classId: string,
): Promise<ClassStudentsResponse> => {
  const url = `/management/classes/${classId}/students`;
  const { data } = await axiosClient.get(url);
  return data;
};

export const importStudentsApi = async ({
  classId,
  students,
}: ImportStudentsPayload) => {
  const url = `/management/classes/${classId}/import-students`;

  const { data } = await axiosClient.post(url, { students });
  return data;
};

// 5. POST: Thêm sinh viên lẻ vào lớp
export const addStudentApi = async ({
  classId,
  ...data
}: AddStudentPayload) => {
  const url = `/management/classes/${classId}/students/add`;
  const { data: response } = await axiosClient.post(url, data);
  return response;
};

// 6. DELETE: Xóa sinh viên khỏi lớp
export const removeStudentsApi = async ({
  classId,
  student_id,
  pending_id,
}: RemoveStudentsPayload) => {
  const url = `/management/classes/${classId}/students`;

  // Gửi data singular
  const { data } = await axiosClient.delete(url, {
    data: {
      student_id: student_id || "",
      pending_id: pending_id || "",
    },
  });
  return data;
};
// 7. PUT: Cập nhật thông tin sinh viên (VD: Set Leader)
export const updateStudentsApi = async ({
  classId,
  ...data
}: UpdateStudentsPayload) => {
  const url = `/management/classes/${classId}/students/update`;

  const { data: response } = await axiosClient.put(url, data);
  return response;
};
