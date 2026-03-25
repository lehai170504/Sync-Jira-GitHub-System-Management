import { axiosClient } from "@/lib/axios-client";
import type { StudentFinalGrade } from "@/features/lecturer/types/grading-types";

export interface ReviewCalculateRequest {
  teamId: string;
  groupGrade: number;
}

export interface ReviewCalculateResponse {
  message?: string;
  teamId?: string;
  groupGrade?: number;
  results?: StudentFinalGrade[];
  students?: StudentFinalGrade[];
  data?: StudentFinalGrade[];
  [key: string]: unknown;
}

/**
 * POST /reviews/calculate
 * Lecturer calculate individual grades for a team.
 */
export async function calculateReviewsApi(
  payload: ReviewCalculateRequest,
): Promise<ReviewCalculateResponse> {
  const { data } = await axiosClient.post<ReviewCalculateResponse>(
    "/reviews/calculate",
    payload,
  );
  return data;
}

