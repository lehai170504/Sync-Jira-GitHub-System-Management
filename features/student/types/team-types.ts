export interface SyncHistoryStats {
  git: number;
  jira_sprints: number;
  jira_tasks: number;
  sync_errors: any[];
}

export interface SyncHistoryLog {
  synced_at: string;
  stats: SyncHistoryStats;
  sync_errors: any[];
}

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

// Định nghĩa Member chi tiết
export interface TeamMemberDetail {
  _id: string;
  student_id: {
    _id: string;
    student_code: string;
    email: string;
    full_name: string;
    avatar_url: string;
  };
  role_in_team: "Leader" | "Member";
}

// Định nghĩa Team chi tiết (Populated)
export interface TeamDetail {
  _id: string;
  project_name: string;

  // Thông tin lớp học
  class_id: {
    _id: string;
    name: string; // SE1837
    class_code: string;
    subjectName: string;
    // ... các field khác nếu cần
  };

  // Config tích hợp (Quan trọng cho form Config)
  github_repo_url?: string;
  jira_project_key?: string;
  jira_url?: string;
  jira_board_id?: number;
  api_token_github?: string;
  api_token_jira?: string;

  last_sync_at?: string;
  sync_history: any[]; // Có thể define kỹ hơn nếu cần
}

// Stats
export interface TeamStats {
  members: number;
  sprints: number;
  tasks: number;
  commits: number;
}

// Response trọn vẹn từ API
export interface TeamDetailResponse {
  team: TeamDetail;
  members: TeamMemberDetail[];
  project: any | null; // Project có thể null nếu chưa init bên hệ thống khác
  stats: TeamStats;
}
