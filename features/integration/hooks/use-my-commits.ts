import { useQuery } from "@tanstack/react-query";
import { getMyCommitsApi } from "../api/my-commits-api";

/**
 * Hook để lấy danh sách commits của bản thân (cho MEMBER)
 * @param branch - Lọc theo nhánh. Không truyền thì trả tất cả.
 */
export const useMyCommits = (branch?: string) => {
  return useQuery({
    queryKey: ["my-commits", branch],
    queryFn: () => getMyCommitsApi(branch),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

