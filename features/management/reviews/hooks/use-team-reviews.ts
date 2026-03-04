import { useQuery } from "@tanstack/react-query";
import {
  getTeamReviewsByTeamApi,
  TeamReviewSummaryResponse,
} from "@/features/management/reviews/api/review-api-client";

export const useTeamReviews = (teamId: string | null, enabled: boolean) => {
  return useQuery<TeamReviewSummaryResponse>({
    queryKey: ["team-reviews", teamId],
    queryFn: () => getTeamReviewsByTeamApi(teamId!),
    enabled: !!teamId && enabled,
    staleTime: 1000 * 60 * 2,
  });
};

