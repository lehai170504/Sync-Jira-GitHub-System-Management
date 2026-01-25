// features/management/lecturers/api/lecturer-classes-api.ts

import { axiosClient } from "@/lib/axios-client";
import { LecturerClassesResponse } from "../types/lecturer-classes-types";

export const getLecturerClassesApi = async (
  lecturerId: string,
): Promise<LecturerClassesResponse> => {
  const { data } = await axiosClient.get(
    `/management/lecturers/${lecturerId}/classes`,
  );
  return data;
};
