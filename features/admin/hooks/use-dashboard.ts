import { useQuery } from "@tanstack/react-query";
import { getAdminOverviewApi } from "../api/dashboard-api";

export const useAdminOverview = () => {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverviewApi,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
};
