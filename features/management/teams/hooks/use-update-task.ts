import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskApi, UpdateTaskPayload } from "../api/task-api";
import { toast } from "sonner";

/**
 * Hook để cập nhật task
 * PUT /api/tasks/:id
 */
export const useUpdateTask = (teamId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskPayload;
    }) => updateTaskApi(taskId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Cập nhật task thành công!");
      queryClient.invalidateQueries({ queryKey: ["team-tasks"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi cập nhật task";
      toast.error(errorMessage);
    },
  });
};
