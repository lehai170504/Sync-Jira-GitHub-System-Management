import { axiosClient } from "@/lib/axios-client";
import { CreateSchedulePayload, Schedule } from "../types/schedule-type";

// POST: Map classId -> class_id
export const createScheduleApi = async (
  payload: CreateSchedulePayload,
): Promise<void> => {
  await axiosClient.post("/academic/schedules", {
    ...payload,
    class_id: payload.classId,
  });
};

// GET: Lấy danh sách
export const getClassSchedulesApi = async (
  classId: string,
): Promise<Schedule[]> => {
  const { data } = await axiosClient.get(
    `/academic/classes/${classId}/schedules`,
  );
  return data;
};
