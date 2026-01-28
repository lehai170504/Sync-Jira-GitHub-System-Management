import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTeamConfigApi } from "../api/project-api";
import { TeamConfigPayload } from "../types/types";

export const useUpdateTeamConfig = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TeamConfigPayload) =>
      updateTeamConfigApi(teamId, payload),
    onSuccess: () => {
      toast.success("Cập nhật cấu hình thành công!");
      // Refresh lại thông tin Project/Team để UI cập nhật
      queryClient.invalidateQueries({ queryKey: ["my-project"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi cập nhật cấu hình");
    },
  });
};
