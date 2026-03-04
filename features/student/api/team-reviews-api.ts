import { axiosClient } from "@/lib/axios-client";
import { TeamReviewsResponse } from "../types/review-types";

// --- 2. API FUNCTION ---
export const getTeamReviewsApi = async (
  teamId: string,
): Promise<TeamReviewsResponse> => {
  const { data } = await axiosClient.get(`/reviews/team/${teamId}`);
  return data;
};
