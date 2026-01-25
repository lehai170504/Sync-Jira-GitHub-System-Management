import { useQuery } from "@tanstack/react-query";
import { getTeamDetailApi } from "../api/team-api";

export const useTeamDetail = (teamId: string | undefined | null) => {
  return useQuery({
    queryKey: ["team-detail", teamId], // Cache theo teamId
    queryFn: () => getTeamDetailApi(teamId!),
    enabled: !!teamId, // Chỉ chạy khi có teamId
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 1,
  });
};
