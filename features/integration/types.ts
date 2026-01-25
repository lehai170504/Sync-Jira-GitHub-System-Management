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