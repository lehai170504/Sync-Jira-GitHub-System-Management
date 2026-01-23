import { useQuery } from "@tanstack/react-query";
import { getJiraProjectsApi } from "../api/jira-api";

export const useJiraProjects = (isEnabled: boolean) => {
  return useQuery({
    queryKey: ["jira-projects"],
    queryFn: getJiraProjectsApi,
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });
};
