// 1. Các Interface phụ trợ cho Class Info
export interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
}

export interface Semester {
  _id: string;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface Lecturer {
  _id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

export interface ContributionConfig {
  jiraWeight: number;
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean;
}

export interface GradeStructure {
  _id: string;
  name: string;
  weight: number;
  isGroupGrade: boolean;
}

// 2. Định nghĩa chi tiết Class (được populate trong Team)
export interface ClassInfo {
  _id: string;
  name: string;
  class_code: string;
  subjectName: string;
  subject_id: Subject;
  status: string;
  semester_id: Semester;
  lecturer_id: Lecturer;
  contributionConfig: ContributionConfig;
  gradeStructure: GradeStructure[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// 3. Định nghĩa Sync History
export interface SyncHistoryStats {
  git: number;
  jira_sprints: number;
  jira_tasks: number;
  sync_errors?: any[];
}

export interface SyncHistoryLog {
  synced_at: string;
  stats: SyncHistoryStats;
  sync_errors?: any[];
}

// 4. Định nghĩa Student Info
export interface StudentInfo {
  _id: string;
  student_code: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

// 5. Định nghĩa Member chi tiết
export interface TeamMemberDetail {
  _id: string;
  student_id: StudentInfo | null;
  role_in_team: "Leader" | "Member";
  project_id: string | null;
}

// 6. Định nghĩa Team chi tiết (Populated)
export interface TeamDetail {
  _id: string;
  project_name: string;
  class_id: ClassInfo;
  jira_story_point_field?: string;
  api_token_github?: string;
  api_token_jira?: string;
  github_repo_url?: string;
  jira_board_id?: number;
  jira_project_key?: string;
  jira_url?: string;
  sync_history: SyncHistoryLog[];
  created_at: string;
  last_sync_at?: string;
  __v?: number;
}

// 7. Stats
export interface TeamStats {
  members: number;
  sprints: number;
  tasks: number;
  commits: number;
}

// 👇 THÊM MỚI: Định nghĩa chi tiết cho Project dựa theo JSON BE mới
export interface ProjectInfo {
  _id: string;
  name: string;
  class_id: string;
  team_id: string;
  semester_id: {
    _id: string;
    name: string;
    code: string;
  };
  subject_id: {
    _id: string;
    name: string;
    code: string;
  };
  leader_id: StudentInfo;
  lecturer_id: string;
  members: StudentInfo[];
  githubRepoUrl?: string; // Nằm trong project thay vì team
  jiraProjectKey?: string; // Nằm trong project thay vì team
  created_at: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// 👇 CẬP NHẬT LẠI: Response trọn vẹn từ API
export interface TeamDetailResponse {
  team: TeamDetail;
  members: TeamMemberDetail[];
  project: ProjectInfo | null; // Cập nhật từ 'any | null' thành interface chuẩn
  stats: TeamStats;
}

//============================================
//Response check role
export interface MyTeamRoleResponse {
  team_id: string;
  role_in_team: "Leader" | "Member";
  is_leader: boolean;
  is_member: boolean;
}

//============================================
//List Team
export interface Team {
  _id: string;
  class_id: {
    _id: string;
    name: string;
    class_code: string;
  };
  project_name: string;
  sync_history: SyncHistoryLog[];
  created_at: string;

  github_repo_url?: string;
  jira_project_key?: string;
  jira_url?: string;
  jira_board_id?: number;

  api_token_github?: string;
  api_token_jira?: string;

  last_sync_at?: string;
}

export interface ClassTeamsResponse {
  total: number;
  teams: Team[];
}
