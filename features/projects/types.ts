// Định nghĩa Payload gửi lên server
export interface CreateProjectPayload {
  name: string;
  members: string[]; // Mảng các ID sinh viên
  githubRepoUrl: string; // Lấy từ GithubRepo.url
  jiraProjectKey: string; // Lấy từ JiraProject.key
}

// Định nghĩa dữ liệu Project trả về khi thành công
export interface Project {
  _id: string;
  name: string;
  githubRepoUrl: string;
  jiraProjectKey: string;
  leader_id: string;
  team_id: string;
  created_at: string;
}

export interface CreateProjectResponse {
  message: string;
  project: Project;
}

export interface ProjectUser {
  _id: string;
  student_code?: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

export interface ProjectDetail {
  _id: string;
  name: string;
  leader_id: ProjectUser;
  lecturer_id: ProjectUser;
  members: ProjectUser[];
  githubRepoUrl: string;
  jiraProjectKey: string;
  created_at: string;
  /** BE gửi khi getMyProject lazy-sync Jira trả 410; vẫn hiển thị project bình thường */
  jira_sync_warning?: string;
}

export interface MyProjectResponse {
  project: ProjectDetail;
}

// 1. Type cho Member (Dùng chung cho leader_id, lecturer_id, và items trong members)
export interface ProjectMember {
  _id: string;
  student_code: string; // JSON: "SE172095"
  email: string; // JSON: "thienhpse172095@fpt.edu.vn"
  full_name: string; // JSON: "Huynh Phuoc Thien (K17 HCM)"
  avatar_url: string; // JSON: "http://..."
}

// 2. Type cho Project (Khớp 1-1 với JSON Object trong mảng projects)
export interface ProjectManagement {
  _id: string;
  name: string;
  leader_id: ProjectMember;
  lecturer_id?: ProjectMember;
  members: ProjectMember[];
  githubRepoUrl?: string;
  jiraProjectKey?: string;
  created_at: string;
  updatedAt?: string;
}

// 3. Type cho Response bọc ngoài cùng ({ total, projects })
export interface ProjectsApiResponse {
  total: number;
  projects: ProjectManagement[];
}
