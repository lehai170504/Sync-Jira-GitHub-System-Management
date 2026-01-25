import { useQuery } from "@tanstack/react-query";
import { getTeamDashboardApi } from "../api/team-api";

/**
 * Hook để lấy dữ liệu dashboard của team
 * @param teamId - ID của team
 */
export const useTeamDashboard = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-dashboard", teamId],
    queryFn: () => {
      if (!teamId) {
        throw new Error("Team ID is required");
      }
      return getTeamDashboardApi(teamId);
    },
    enabled: !!teamId, // Chỉ gọi API khi có teamId
    staleTime: 30 * 1000, // 30 giây - dữ liệu dashboard cần refresh thường xuyên
    refetchOnWindowFocus: true, // Tự động refetch khi focus lại window
  });
};

