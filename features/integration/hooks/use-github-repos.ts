import { useQuery } from "@tanstack/react-query";
import { getGithubReposApi } from "../api/github-api";

export const useGithubRepos = (isEnabled: boolean) => {
  return useQuery({
    queryKey: ["github-repos"],
    queryFn: getGithubReposApi,
    enabled: isEnabled, // Chỉ gọi khi đã kết nối
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
