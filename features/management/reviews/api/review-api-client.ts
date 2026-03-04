/**
 * Client-side API for team reviews - gọi trực tiếp /reviews/team/{teamId}
 */

import { axiosClient } from "@/lib/axios-client";

export type TeamReviewStudent = {
  _id: string;
  student_code: string;
  email: string;
  full_name: string;
  avatar_url: string;
};

export type TeamReviewFeedback = {
  evaluator: TeamReviewStudent;
  rating: number;
  comment: string;
  submitted_at: string;
};

export type TeamReviewEvaluationItem = {
  student: TeamReviewStudent;
  review_count: number;
  average_rating: number;
  feedbacks_received: TeamReviewFeedback[];
};

export type TeamReviewSummaryResponse = {
  team_id: string;
  total_reviews_submitted: number;
  evaluation_summary: TeamReviewEvaluationItem[];
};

export async function getTeamReviewsByTeamApi(
  teamId: string,
): Promise<TeamReviewSummaryResponse> {
  const { data } = await axiosClient.get(`/reviews/team/${teamId}`);
  return data;
}
