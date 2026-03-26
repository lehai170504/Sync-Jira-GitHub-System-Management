import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskApi, CreateTaskPayload } from "../api/task-api";
import { toast } from "sonner";

/**
 * Hook để tạo task mới
 * POST /api/tasks
 */
export const useCreateTask = (teamId: string | undefined) => {
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
    mutationFn: (payload: Omit<CreateTaskPayload, "team_id">) => {
      if (!teamId) throw new Error("Team ID is required");
      return createTaskApi({ ...payload, team_id: teamId });
    },
    onSuccess: (data) => {
      toast.success(data.message || "✅ Thêm task thành công!");
      invalidateTaskQueries();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi thêm task";
      toast.error(errorMessage);
    },
  });
};
