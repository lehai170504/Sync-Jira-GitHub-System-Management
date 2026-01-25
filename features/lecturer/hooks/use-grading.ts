import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGradingConfigApi } from "../api/grading-api";
import { GradingConfigPayload } from "../types/grading-types";
import { toast } from "sonner";

export const useUpdateGradingConfig = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GradingConfigPayload) =>
      updateGradingConfigApi(classId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Cấu hình điểm thành công!");

      queryClient.invalidateQueries({ queryKey: ["class-details", classId] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Lỗi cập nhật cấu hình";
      toast.error(msg);
    },
  });
};
