import { useQuery } from "@tanstack/react-query";
import { getMyCommitsApi } from "../api/my-commits-api";

/**
 * Hook để lấy danh sách commits của bản thân (cho MEMBER)
 */
export const useMyCommits = () => {
  return useQuery({
    queryKey: ["my-commits"],
    queryFn: getMyCommitsApi,
    staleTime: 30 * 1000, // Cache 30 giây
    refetchOnWindowFocus: true, // Tự động refetch khi focus lại cửa sổ
  });
};

