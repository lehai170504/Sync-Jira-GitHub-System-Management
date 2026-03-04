import { serverRequest } from "@/lib/axios-server";

export type SubmitReviewItem = {
  evaluated_id: string;
  rating: number;
  comment: string;
};

export type SubmitReviewsPayload = {
  teamId: string;
  reviews: SubmitReviewItem[];
};

export async function submitReviewsApi(payload: SubmitReviewsPayload) {
  return serverRequest("POST", "/reviews/submit", payload);
}

