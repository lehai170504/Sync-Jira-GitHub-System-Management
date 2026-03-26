"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateClassContributionConfigApi,
  type UpdateContributionConfigPayload,
} from "../api/contribution-config-api";

export function useUpdateContributionConfig(classId: string | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContributionConfigPayload) => {
      if (!classId) throw new Error("classId is required");
      return updateClassContributionConfigApi(classId, payload);
    },
    onSuccess: async () => {
      toast.success("Đã cập nhật trọng số đóng góp");
      if (classId) {
        await qc.invalidateQueries({ queryKey: ["class-details", classId] });
      }
    },
    onError: (e: any) => {
      toast.error("Không thể cập nhật cấu hình", {
        description: e?.message || "Vui lòng thử lại.",
      });
    },
  });
}

