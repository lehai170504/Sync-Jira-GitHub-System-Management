import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSprintApi } from "../api/sprint-api";
import { toast } from "sonner";

/**
 * Hook để xóa sprint
 * DELETE /sprints/:id
 */
export const useDeleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sprintId: string) => deleteSprintApi(sprintId),
    onSuccess: (data) => {
      toast.success(data.message || "✅ Đã xóa sprint");
      queryClient.invalidateQueries({ queryKey: ["team-sprints"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi xóa sprint";
      toast.error(errorMessage);
    },
  });
};
