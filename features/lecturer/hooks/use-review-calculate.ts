"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  calculateReviewsApi,
  type ReviewCalculateRequest,
} from "../api/review-calculate-api";

export function useReviewCalculate() {
  return useMutation({
    mutationFn: (payload: ReviewCalculateRequest) => calculateReviewsApi(payload),
    onError: (e: any) => {
      toast.error("Không thể tính điểm", {
        description: e?.message || "Vui lòng thử lại.",
      });
    },
  });
}

