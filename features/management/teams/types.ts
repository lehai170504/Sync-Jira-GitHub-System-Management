// Types for Teams API

/**
 * GET /teams/:teamId/dashboard
 * Contract (Tổng quan member & leader dùng chung):
 * @example
 * {
 *   "team": { "_id", "project_name", "last_sync_at": string | null },
 *   "overview": {
 *     "tasks": { total, done, todo, done_percent, story_point_total, story_point_done },
 *     "commits": { total, counted, last_commit_date: string | null },
 *     "sprints": { total, active }
 *   }
 * }
 */
export interface TeamDashboardResponse {
  team: {
    _id: string;
    project_name: string;
    last_sync_at: string | null;
    jira_url?: string;
    jira_project_key?: string;
    jira_board_id?: number;
    github_repo_url?: string;
  };
  overview: {
    tasks: {
      total: number;
      done: number;
      todo: number;
      done_percent: number;
      story_point_total: number;
      story_point_done: number;
    };
    commits: {
      total: number;
      counted: number;
      last_commit_date: string | null;
    };
    sprints: {
      total: number;
      active: number;
    };
  };
}

export interface UpdateTeamConfigPayload {
  jira_url: string;
  jira_project_key: string;
  jira_board_id: number;
  api_token_jira: string;
  github_repo_url: string;
  api_token_github: string;
}

export interface UpdateTeamConfigResponse {
  message: string;
  team: {
    _id: string;
    class_id: string;
    project_name: string;
    jira_story_point_field?: string;
    sync_history?: any[];
    created_at: string;
    __v?: number;
    api_token_github: string;
    api_token_jira: string;
    github_repo_url: string;
    jira_board_id: number;
    jira_project_key: string;
    jira_url: string;
    last_sync_at?: string | null;
  };
}

export interface TeamSprintItem {
  name: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  state: string; // e.g. "active" | "closed" | "future"
  /** Optional IDs if BE includes them */
  _id?: string;
  id?: string;
}

/** GET /api/teams/:teamId/sprints */
export type TeamSprintsResponse = TeamSprintItem[];

export interface TeamTaskItem {
  _id: string;
  issue_id?: string;
  issue_key: string;
  sprint_id: string;
  status_category: string; // e.g. "To Do" | "In Progress" | "Done"
  story_point?: number;
  updated_at?: string; // ISO date

  // Assignee fields (can be null for unassigned tasks)
  assignee_account_id?: string | null; // Jira account id
  assignee_id?: string | null;
  assignee_name?: string;

  // Optional fields (BE may include them)
  summary?: string;
  title?: string;
}

/** GET /api/teams/:teamId/tasks?sprintId=... */
export interface TeamTasksResponse {
  total: number;
  tasks: TeamTaskItem[];
}

export interface TeamCommitItem {
  _id: string;
  team_id: string;
  hash: string;
  author_email: string;
  commit_date: string; // ISO date
  is_counted: boolean;
  message: string;
  rejection_reason?: string | null;
  /** Mảng các nhánh chứa commit (BE trả về) */
  branches?: string[];
  __v?: number;
}

/** GET /api/teams/:teamId/commits */
export interface TeamCommitsResponse {
  total: number;
  commits: TeamCommitItem[];
}

/** GET /api/teams/:teamId/ranking */
export interface TeamRankingSummary {
  total_team_valid_commits: number;
  total_team_done_story_points: number;
}

/** Sinh viên trong một dòng ranking (integrations có thể chứa token — không hiển thị ra UI) */
export interface TeamRankingStudent {
  _id: string;
  student_code: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  integrations?: Record<string, unknown>;
  git_emails?: string[];
}

export interface TeamRankingMemberRow {
  member_id: string;
  student: TeamRankingStudent | null;
  role_in_team: string;
  mapping: {
    jira_account_id: string | null;
    github_username: string | null;
  };
  /** Legacy BE: điểm 0..1 ở root */
  git_score?: number;
  jira_score?: number;
  jira: {
    done_tasks: number;
    done_story_points: number;
    total_tasks: number;
    total_story_points: number;
    /** 0..1 — ưu tiên so với jira_score root */
    jira_score?: number;
  };
  github: {
    counted_commits: number;
    personal_valid_commits?: number;
    total_team_valid_commits?: number;
    /** 0..1 — ưu tiên so với git_score root */
    git_score?: number;
  };
}

export interface TeamRankingResponse {
  total: number;
  summary?: TeamRankingSummary;
  ranking: TeamRankingMemberRow[];
}

