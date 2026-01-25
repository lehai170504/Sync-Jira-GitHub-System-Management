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

