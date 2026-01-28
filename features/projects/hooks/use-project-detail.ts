// features/management/projects/hooks/use-project-detail.ts
import { useQuery } from "@tanstack/react-query";
import { getTeamProjectDetail } from "../api/project-api";

export const useProjectDetail = (teamId: string | null) => {
  return useQuery({
    queryKey: ["project-detail", teamId],
    queryFn: () => getTeamProjectDetail(teamId!),
    enabled: !!teamId, // Chỉ fetch khi có teamId
    staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút
  });
};
