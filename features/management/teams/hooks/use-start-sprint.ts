import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startSprintApi, StartSprintPayload } from "../api/sprint-api";
import { toast } from "sonner";

/**
 * Hook POST /sprints/:id/start
 */
export const useStartSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sprintId,
      payload,
    }: {
      sprintId: string;
      payload: StartSprintPayload;
    }) => startSprintApi(sprintId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Đã bắt đầu sprint!");
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi bắt đầu sprint";
      toast.error(errorMessage);
    },
  });
};
