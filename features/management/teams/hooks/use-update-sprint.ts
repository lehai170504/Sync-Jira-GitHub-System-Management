import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSprintApi, UpdateSprintPayload } from "../api/sprint-api";
import { toast } from "sonner";

/**
 * Hook để cập nhật sprint
 * PUT /sprints/:id
 */
export const useUpdateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sprintId,
      payload,
    }: {
      sprintId: string;
      payload: UpdateSprintPayload;
    }) => updateSprintApi(sprintId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Cập nhật sprint thành công!");
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi cập nhật sprint";
      toast.error(errorMessage);
    },
  });
};
