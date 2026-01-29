// Types for Teams API

export interface TeamDashboardResponse {
  team: {
    _id: string;
    project_name: string;
    last_sync_at: string | null;
    // Optional config fields (có thể được BE trả về)
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

