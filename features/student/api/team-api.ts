import { axiosClient } from "@/lib/axios-client";
import { ClassTeamsResponse } from "../types/team-types";

// API lấy danh sách nhóm trong lớp
export const getClassTeamsApi = async (
  classId: string,
): Promise<ClassTeamsResponse> => {
  const { data } = await axiosClient.get("/teams", {
    params: { class_id: classId },
  });
  return data;
};
