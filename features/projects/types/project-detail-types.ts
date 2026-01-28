// features/management/projects/types/project-detail-types.ts

export interface SyncLog {
  synced_at: string;
  stats: {
    git: number;
    jira_tasks: number;
  };
}

export interface TeamDetailResponse {
  team: {
    _id: string;
    project_name: string;
    github_repo_url?: string;
    jira_project_key?: string;
    jira_url?: string;
    last_sync_at?: string;
    sync_history: SyncLog[];
  };
  members: Array<{
    _id: string;
    student_id: {
      _id: string;
      full_name: string;
      email: string;
      avatar_url: string;
      student_code: string;
    };
    role_in_team: "Leader" | "Member";
  }>;
  stats: {
    members: number;
    commits: number;
    tasks: number;
    sprints: number;
  };
}
