import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createScheduleApi, getClassSchedulesApi } from "../api/schedule-api";
import { CreateSchedulePayload } from "../types/schedule-type";
import { toast } from "sonner";

// Hook lấy danh sách lịch
export const useClassSchedules = (classId: string | undefined) => {
  return useQuery({
    queryKey: ["lecturer-schedules", classId],
    queryFn: () => getClassSchedulesApi(classId!),
    enabled: !!classId,
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
};

// Hook tạo lịch mới
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) => createScheduleApi(payload),
    onSuccess: () => {
      toast.success("Tạo lịch thành công!");
      // Làm mới danh sách sau khi tạo
      queryClient.invalidateQueries({ queryKey: ["lecturer-schedules"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi tạo lịch");
    },
  });
};
