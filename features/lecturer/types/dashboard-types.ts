export interface TeamDashboardInfo {
  team_id: string;
  project_name: string;
  class_name: string;
  member_count: number;
}

export interface TeamProjectHealth {
  total_jira_sp_done: number;
  total_git_ai_score: number;
  average_peer_review: number;
  team_total_commits: number;
  team_approved_commits: number;
  team_total_tasks: number;
}

export interface TeamMemberBreakdown {
  student_id: string;
  student_code: string;
  full_name: string;
  avatar_url: string;
  role: string;
  /** 0..1 — ưu tiên cho điểm Git; UI: scoreRatioToDisplay10 */
  git_score?: number;
  /** 0..1 — ưu tiên cho điểm Jira (root, không dùng scores.jira_score lồng ghép) */
  jira_score?: number;
  raw_counts: {
    total_commits: number;
    approved_commits: number;
    total_jira_tasks: number;
  };
  raw_scores: {
    jira_sp_done: number;
    git_ai_score: number;
    peer_review_score: number;
  };
  contribution_percentages: {
    jira_percent: number;
    git_percent: number;
    review_percent: number;
  };
  grading: {
    contribution_factor: number;
    final_score: number;
  };
}

export interface TeamDashboardResponse {
  message: string;
  team_info: TeamDashboardInfo;
  project_health: TeamProjectHealth;
  members_breakdown: TeamMemberBreakdown[];
}
