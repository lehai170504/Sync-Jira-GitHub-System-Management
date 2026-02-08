// ==========================================
// 1. SUB-INTERFACES
// ==========================================

export interface ContributionConfig {
  jiraWeight: number;
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean;
}

export interface GradeStructureItem {
  _id: string;
  name: string;
  weight: number;
  isGroupGrade: boolean;
}

export interface SubjectInfo {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
}

export interface SemesterInfo {
  _id: string;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface LecturerInfo {
  _id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

// ==========================================
// 2. CHI TIẾT LỚP HỌC (Class Object)
// ==========================================

export interface ClassDetailInfo {
  _id: string;
  name: string;
  class_code: string;
  subjectName: string;
  status: string;

  subject_id: SubjectInfo;
  semester_id: SemesterInfo;
  lecturer_id: LecturerInfo;

  contributionConfig: ContributionConfig;
  gradeStructure: GradeStructureItem[];

  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ==========================================
// 3. THÔNG TIN NHÓM (Teams)
// ==========================================

export interface TeamInClass {
  _id: string;
  project_name: string;

  // Các trường optional dựa trên JSON response
  github_repo_url?: string;
  jira_project_key?: string;
  last_sync_at?: string; // Mới thêm từ JSON
}

// ==========================================
// 4. THỐNG KÊ (Stats)
// ==========================================

export interface ClassStats {
  total_teams: number;
  total_students: number;
  total_projects: number;
}

// ==========================================
// 5. MAIN RESPONSE
// ==========================================

export interface ClassDetailResponse {
  class: ClassDetailInfo;
  teams: TeamInClass[];
  stats: ClassStats;
}
