import { useQuery } from "@tanstack/react-query";
import { getTeamReviewsApi } from "../api/team-reviews-api";

export const useTeamReviews = (teamId: string | null) => {
  return useQuery({
    queryKey: ["team-reviews", teamId],
    queryFn: () => getTeamReviewsApi(teamId!),
    enabled: !!teamId, // Chỉ gọi API khi có teamId
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
