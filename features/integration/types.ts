export interface GithubRepo {
  id: number;
  name: string;
  url: string;
}

// 2. Interface cho Response bao bọc bên ngoài
export interface GithubReposResponse {
  total: number;
  repos: GithubRepo[];
}

export interface JiraProject {
  id: string;
  key: string; // VD: "PROJ"
  name: string; // VD: "My Project Name"
}

export interface JiraProjectsResponse {
  total: number;
  projects: JiraProject[];
}

export interface SyncResponse {
  message: string;
  stats: {
    github: number;
    jira: number;
    /** BE gửi khi Jira 410 hoặc lỗi khác; GitHub vẫn có thể đã sync OK */
    errors?: string[];
  };
}

export interface IntegrationProjectRef {
  _id: string;
  name: string;
  team_id: string;
}

// Commit types for my-commits API
export interface MyCommitItem {
  _id: string;
  team_id: string;
  hash: string;
  author_email: string;
  author_name?: string;
  branch?: string;
  /** Mảng các nhánh chứa commit (BE có thể trả về) */
  branches?: string[];
  commit_date: string; // ISO date
  is_counted: boolean;
  jira_issues?: any[];
  message: string;
  rejection_reason?: string | null;
  url?: string;
  __v?: number;
}

export interface MyCommitsResponse {
  projects: IntegrationProjectRef[];
  total: number;
  commits: MyCommitItem[];
}