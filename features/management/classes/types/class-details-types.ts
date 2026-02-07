// features/management/classes/types/class-types.ts

// ==========================================
// 1. SUB-INTERFACES (Các object con)
// ==========================================

export interface ContributionConfig {
  jiraWeight: number; // VD: 0.4
  gitWeight: number; // VD: 0.4
  reviewWeight: number; // VD: 0.2
  allowOverCeiling: boolean; // VD: false
}

// Cấu trúc Grade Structure (Dù mảng rỗng [] nhưng vẫn cần định nghĩa type để tránh lỗi khi có dữ liệu)
export interface GradeStructureItem {
  _id: string;
  name: string;
  weight: number;
  isGroupGrade: boolean;
}

export interface SubjectInfo {
  _id: string;
  name: string; // VD: "Software Requirement"
  code: string; // VD: "SWR302"
  description: string; // VD: "Môn học về quản lý..."
  credits: number; // VD: 3
}

export interface SemesterInfo {
  _id: string;
  name: string; // VD: "Spring 2026"
  code: string; // VD: "SP2026"
  start_date: string; // ISO Date
  end_date: string; // ISO Date
  status: string; // VD: "Open"
}

export interface LecturerInfo {
  _id: string;
  email: string;
  full_name: string;
  avatar_url: string; // URL ảnh
}

// ==========================================
// 2. CHI TIẾT LỚP HỌC (Class Object)
// ==========================================

export interface ClassDetailInfo {
  _id: string;
  name: string; // VD: "SE1832"
  class_code: string; // VD: "SE1832"
  subjectName: string; // VD: "Software Requirement"
  status: string; // VD: "Active"

  // Các trường đã Populated (Chi tiết object)
  subject_id: SubjectInfo;
  semester_id: SemesterInfo;
  lecturer_id: LecturerInfo;

  contributionConfig: ContributionConfig;
  gradeStructure: GradeStructureItem[]; // Có thể là mảng rỗng []

  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ==========================================
// 3. THÔNG TIN NHÓM (Teams)
// ==========================================

export interface TeamInClass {
  _id: string;
  project_name: string; // VD: "Group 1"

  // Các trường optional (có thể chưa có trong response mẫu nhưng thường sẽ cần sau này)
  github_repo_url?: string;
  jira_project_key?: string;
}

// ==========================================
// 4. THỐNG KÊ (Stats)
// ==========================================

export interface ClassStats {
  total_teams: number; // VD: 1
  total_students: number; // VD: 1
  total_projects: number; // VD: 0
}

// ==========================================
// 5. MAIN RESPONSE (Type trả về từ API)
// ==========================================

export interface ClassDetailResponse {
  class: ClassDetailInfo;
  teams: TeamInClass[];
  stats: ClassStats;
}
