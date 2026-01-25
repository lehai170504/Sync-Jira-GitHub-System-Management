// 1. Các Sub-types (Dùng chung)

export interface AdminShort {
  _id: string;
  email: string;
  full_name: string;
}

export interface LecturerShort {
  _id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

export interface SubjectShort {
  _id: string;
  name: string;
  code: string;
}

// 2. Cấu hình điểm & Đóng góp (Contribution)
export interface ContributionConfig {
  jiraWeight: number; // VD: 0.4
  gitWeight: number; // VD: 0.4
  reviewWeight: number; // VD: 0.2
  allowOverCeiling: boolean; // VD: false
}

export interface GradeStructureItem {
  _id: string;
  name: string; // VD: "Assignment 1"
  weight: number; // VD: 0.2
  isGroupGrade: boolean; // VD: false
}

// 3. Chi tiết một Lớp học trong Học kỳ
export interface ClassInSemester {
  _id: string;
  name: string; // VD: "IA1080"
  class_code: string; // VD: "IA1080"
  subjectName: string; // VD: "Database Systems"

  // Thông tin môn học
  subject_id: SubjectShort;

  // Trạng thái lớp
  status: "Active" | "Archived" | "Completed";

  // Giảng viên (Có thể null nếu chưa assign)
  lecturer_id: LecturerShort | null;

  // Cấu hình chi tiết của lớp
  contributionConfig: ContributionConfig;
  gradeStructure: GradeStructureItem[];
}

// 4. Thông tin chi tiết Học kỳ (Metadata)
export interface SemesterInfo {
  _id: string;
  name: string; // VD: "Spring 2026"
  code: string; // VD: "SP2026"
  start_date: string; // ISO Date string
  end_date: string; // ISO Date string
  status: "Open" | "Closed" | "Ended"; // Dựa trên response "Open"

  created_by_admin?: AdminShort;
  created_at: string;
  __v?: number;
}

// 5. Thống kê Học kỳ
export interface SemesterDetailStats {
  total_classes: number;
  active_classes: number;
  archived_classes: number;
  total_lecturers: number;
}

// --- MAIN RESPONSE TYPE ---
export interface SemesterDetailResponse {
  semester: SemesterInfo;
  classes: ClassInSemester[];
  stats: SemesterDetailStats;
}
