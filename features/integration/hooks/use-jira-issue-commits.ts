import { useQuery } from "@tanstack/react-query";
import { getJiraIssueCommitsApi } from "../api/jira-issue-commits-api";

/**
 * GET /api/integrations/jira/issues/:issueKey/commits?projectId=...
 */
export const useJiraIssueCommits = (
  issueKey: string | undefined,
  projectId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["jira-issue-commits", issueKey, projectId],
    queryFn: () => getJiraIssueCommitsApi(issueKey!, projectId!),
    enabled: !!issueKey && !!projectId && enabled,
    staleTime: 60 * 1000,
  });
};
