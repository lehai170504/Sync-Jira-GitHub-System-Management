import { axiosClient } from "@/lib/axios-client";
import { ClassDetailResponse } from "../types/class-details-types";

export const getClassDetailsApi = async (
  classId: string,
): Promise<ClassDetailResponse> => {
  const { data } = await axiosClient.get(`/management/classes/${classId}`);
  return data;
};
