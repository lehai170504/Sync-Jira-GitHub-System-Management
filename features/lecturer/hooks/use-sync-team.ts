import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncProjectDataApi } from "../api/team-sync-api";
import { toast } from "sonner";

export const useSyncProjectManual = (projectId: string, teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // Gọi API bằng projectId
    mutationFn: () => syncProjectDataApi(projectId),
    onSuccess: () => {
      toast.success("Đồng bộ dữ liệu thành công!");
      // Làm mới lại data chi tiết nhóm trên UI bằng teamId
      queryClient.invalidateQueries({ queryKey: ["team-detail", teamId] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Đồng bộ thất bại, vui lòng thử lại!"
      );
    },
  });
};
