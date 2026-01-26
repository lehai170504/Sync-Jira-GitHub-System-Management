import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeamConfigApi } from "../api/team-api";
import { UpdateTeamConfigPayload } from "../types";
import { toast } from "sonner";

/**
 * Hook để cập nhật cấu hình team (chỉ dành cho Leader)
 */
export const useUpdateTeamConfig = (teamId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTeamConfigPayload) => {
      if (!teamId) {
        throw new Error("Team ID is required");
      }
      return updateTeamConfigApi(teamId, payload);
    },
    onSuccess: (data) => {
      toast.success(data.message || "✅ Cập nhật cấu hình thành công!");
      // Invalidate team-related queries để refetch data
      queryClient.invalidateQueries({ queryKey: ["team-dashboard", teamId] });
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi cập nhật cấu hình";
      toast.error(errorMessage);
    },
  });
};

