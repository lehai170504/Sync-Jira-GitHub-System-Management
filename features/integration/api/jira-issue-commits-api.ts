import { axiosClient } from "@/lib/axios-client";

export interface JiraIssueCommit {
  hash: string;
  message: string;
  author_email?: string;
  commit_date?: string;
  branch?: string;
  branches?: string[];
  jira_issues?: string[];
}

export interface JiraIssueCommitsResponse {
  commits?: JiraIssueCommit[];
  total?: number;
}

/**
 * GET /api/integrations/jira/issues/{issueKey}/commits
 * Lấy danh sách GitHub commits thuộc về 1 Jira Issue (Smart Linking)
 * @param issueKey - Jira issue key (VD: SCRUM-12)
 * @param projectId - ID project để lọc commits
 * @param limit - Số commits tối đa (mặc định 50, tối đa 100)
 */
export const getJiraIssueCommitsApi = async (
  issueKey: string,
  projectId: string,
  limit?: number,
): Promise<JiraIssueCommitsResponse> => {
  const params: Record<string, string | number> = { projectId };
  if (limit != null) params.limit = limit;
  const { data } = await axiosClient.get<JiraIssueCommitsResponse>(
    `/integrations/jira/issues/${encodeURIComponent(issueKey)}/commits`,
    { params },
  );
  return data;
};
