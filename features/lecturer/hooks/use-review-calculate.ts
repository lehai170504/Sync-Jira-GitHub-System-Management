"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  calculateReviewsApi,
  getClassGradesApi,
  type ReviewCalculateRequest,
} from "../api/review-calculate-api";

// 1. Hook Tính điểm (POST)
export function useReviewCalculate(classId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewCalculateRequest) =>
      calculateReviewsApi(payload),
    onSuccess: (data) => {
      toast.success("Tính điểm thành công!", {
        description: data.message || "Hệ thống đã phân bổ điểm cho nhóm.",
      });
      // Gọi tính điểm xong -> F5 lại cục data điểm của cả Lớp
      if (classId) {
        queryClient.invalidateQueries({ queryKey: ["class-grades", classId] });
      }
    },
    onError: (e: any) => {
      toast.error("Không thể tính điểm", {
        description: e?.message || "Vui lòng thử lại.",
      });
    },
  });
}

// 2. Hook Lấy bảng điểm của cả Lớp (GET)
export function useClassGrades(classId?: string) {
  return useQuery({
    queryKey: ["class-grades", classId],
    queryFn: () => getClassGradesApi(classId!),
    enabled: !!classId, // Chỉ gọi khi có ID Lớp
  });
}
