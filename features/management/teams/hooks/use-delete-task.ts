import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskApi } from "../api/task-api";
import { toast } from "sonner";

/**
 * Hook để xóa task
 * DELETE /api/tasks/:id
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const invalidateTaskQueries = () => {
    const keyRoots = ["team-tasks", "team-all-tasks", "member-tasks", "my-tasks"];
    const queries = queryClient
      .getQueryCache()
      .findAll({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          typeof q.queryKey[0] === "string" &&
          keyRoots.includes(q.queryKey[0]),
      });

    queries.forEach((q) => {
      queryClient.invalidateQueries({ queryKey: q.queryKey, exact: true });
    });
  };

  return useMutation({
    mutationFn: (taskId: string) => deleteTaskApi(taskId),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Đã xóa task");
      invalidateTaskQueries();
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
