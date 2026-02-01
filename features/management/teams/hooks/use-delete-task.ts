import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskApi } from "../api/task-api";
import { toast } from "sonner";

/**
 * Hook để xóa task
 * DELETE /api/tasks/:id
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTaskApi(taskId),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Đã xóa task");
      queryClient.invalidateQueries({ queryKey: ["team-tasks"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi xóa task";
      toast.error(errorMessage);
    },
  });
};
