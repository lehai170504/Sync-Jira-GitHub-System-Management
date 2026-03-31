import { axiosClient } from "@/lib/axios-client";

// Lấy toàn bộ data Dashboard của lớp học
export const getClassDashboardApi = async (classId: string) => {
  const { data } = await axiosClient.get(`/dashboard/classes/${classId}`);
  return data;
};
