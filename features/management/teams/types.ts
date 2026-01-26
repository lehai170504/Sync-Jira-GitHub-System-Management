// Types for Teams API

export interface TeamDashboardResponse {
  team: {
    _id: string;
    project_name: string;
    last_sync_at: string | null;
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

