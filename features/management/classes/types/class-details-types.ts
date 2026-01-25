// 1. Config điểm số
export interface ContributionConfig {
  jiraWeight: number;
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean;
}

// 2. Cấu trúc đầu điểm
export interface GradeStructureItem {
  _id: string;
  name: string;
  weight: number;
  isGroupGrade: boolean;
}

// 3. Thông tin chi tiết lớp học
export interface ClassDetailInfo {
  _id: string;
  name: string;
  class_code: string;
  subjectName: string;
  status: string;

  subject_id: {
    _id: string;
    name: string;
    code: string;
    description: string;
    credits: number;
  };

  semester_id: {
    _id: string;
    name: string;
    code: string;
    start_date: string;
    end_date: string;
    status: string;
  };

  lecturer_id: {
    _id: string;
    email: string;
    full_name: string;
    avatar_url: string;
  };

  contributionConfig: ContributionConfig;
  gradeStructure: GradeStructureItem[];
  createdAt: string;
  updatedAt: string;
}

// 4. Thông tin nhóm trong lớp
export interface TeamInClass {
  _id: string;
  project_name: string;
  github_repo_url?: string;
  jira_project_key?: string;
  last_sync_at?: string;
}

// 5. Thống kê
export interface ClassStats {
  total_teams: number;
  total_students: number;
  total_projects: number;
}

// --- MAIN RESPONSE TYPE ---
export interface ClassDetailResponse {
  class: ClassDetailInfo;
  teams: TeamInClass[];
  stats: ClassStats;
}
