export interface AdminShort {
  _id: string;
  email: string;
  full_name: string;
}

export interface LecturerShort {
  _id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export interface SubjectShort {
  _id: string;
  name: string;
  code: string;
}

// Cấu hình đóng góp (Contribution)
export interface ContributionConfig {
  jiraWeight: number;
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean;
}

// Cấu trúc điểm (Grade Structure)
export interface GradeStructureItem {
  _id: string;
  name: string;
  weight: number;
  isGroupGrade: boolean;
}

// Chi tiết Lớp học
export interface ClassInSemester {
  _id: string;
  name: string;
  class_code: string;
  subjectName: string;
  subject_id: SubjectShort;
  status: string;
  lecturer_id?: LecturerShort;
  contributionConfig?: ContributionConfig;
  gradeStructure?: GradeStructureItem[];
}

// Thông tin Học kỳ
export interface SemesterInfo {
  _id: string;
  name: string;
  code: string;
  created_by_admin: AdminShort;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  __v: number;
}

// Thống kê
export interface SemesterDetailStats {
  total_classes: number;
  active_classes: number;
  archived_classes: number;
  total_lecturers: number;
}

// Response đầy đủ
export interface SemesterDetailResponse {
  semester: SemesterInfo;
  classes: ClassInSemester[];
  stats: SemesterDetailStats;
}
