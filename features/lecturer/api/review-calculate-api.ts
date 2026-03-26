import { axiosClient } from "@/lib/axios-client";

export interface ReviewCalculateRequest {
  teamId: string;
  groupGrade: number;
}

/**
 * POST /reviews/calculate
 * Giảng viên chốt điểm cho 1 nhóm
 */
export async function calculateReviewsApi(payload: ReviewCalculateRequest) {
  const { data } = await axiosClient.post("/reviews/calculate", payload);
  return data;
}

/**
 * GET /reviews/classes/{classId}/grades
 * Lấy bảng điểm tổng hợp của toàn bộ sinh viên trong Lớp
 */
export async function getClassGradesApi(classId: string) {
  const { data } = await axiosClient.get(`/reviews/classes/${classId}/grades`);
  return data;
}
