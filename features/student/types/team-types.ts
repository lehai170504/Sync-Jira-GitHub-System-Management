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

// 3. Định nghĩa Sync History (Giữ nguyên hoặc mở rộng tùy data thực tế)
export interface SyncHistoryStats {
  git: number;
  jira_sprints: number;
  jira_tasks: number;
  sync_errors?: any[]; // Optional vì trong JSON là mảng rỗng
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
  // Lưu ý: student_id có thể null (như trong phần tử đầu tiên và thứ 3 của mảng members)
  student_id: StudentInfo | null;
  role_in_team: "Leader" | "Member";
  project_id: string | null;
}

// 6. Định nghĩa Team chi tiết (Populated)
export interface TeamDetail {
  _id: string;
  project_name: string;

  // Thông tin lớp học đã populated đầy đủ
  class_id: ClassInfo;

  // Config tích hợp
  jira_story_point_field?: string;
  api_token_github?: string;
  api_token_jira?: string;
  github_repo_url?: string;
  jira_board_id?: number;
  jira_project_key?: string;
  jira_url?: string;

  // Metadata & Sync
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

// 8. Response trọn vẹn từ API
export interface TeamDetailResponse {
  team: TeamDetail;
  members: TeamMemberDetail[];
  project: any | null; // Project có thể null nếu chưa init
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
  sync_history: SyncHistoryLog[]; // Cập nhật type cụ thể thay vì any[]
  created_at: string;

  // 👇 Các trường bổ sung (Optional vì nhóm mới tạo chưa có)
  github_repo_url?: string;
  jira_project_key?: string;
  jira_url?: string;
  jira_board_id?: number;

  // Các field nhạy cảm (thường FE không nên hiển thị, nhưng nếu API trả về thì cứ define)
  api_token_github?: string;
  api_token_jira?: string;

  last_sync_at?: string;
}

export interface ClassTeamsResponse {
  total: number;
  teams: Team[];
}
