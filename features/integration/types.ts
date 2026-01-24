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
