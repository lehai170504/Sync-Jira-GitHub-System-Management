import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskApi, UpdateTaskPayload } from "../api/task-api";
import { toast } from "sonner";

/**
 * Hook để cập nhật task
 * PUT /api/tasks/:id
 */
export const useUpdateTask = (teamId: string | undefined) => {
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
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskPayload;
    }) => updateTaskApi(taskId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Cập nhật task thành công!");
      invalidateTaskQueries();
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
