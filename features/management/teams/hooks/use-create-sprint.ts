import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSprintApi, CreateSprintPayload } from "../api/sprint-api";
import { toast } from "sonner";

/**
 * Hook để tạo sprint mới
 * POST /sprints
 */
export const useCreateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSprintPayload) => createSprintApi(payload),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Tạo sprint thành công!");
      // Invalidate team-sprints query để refetch danh sách sprints
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi tạo sprint";
      toast.error(errorMessage);
    },
  });
};

