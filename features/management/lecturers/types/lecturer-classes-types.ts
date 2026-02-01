// 1. Cấu hình trọng số đóng góp
export interface ContributionConfig {
  jiraWeight: number; // VD: 0.4
  gitWeight: number; // VD: 0.4
  reviewWeight: number; // VD: 0.2
  allowOverCeiling: boolean;
}

// 2. Cấu hình cột điểm
export interface GradeColumn {
  _id: string;
  name: string; // VD: "Assignment 1"
  weight: number; // VD: 0.2
  isGroupGrade: boolean; // Phân biệt điểm cá nhân hay nhóm
}

// 3. Thông tin chi tiết một lớp học
export interface LecturerClassItem {
  _id: string;
  name: string; // Tên hiển thị lớp: "IA1080"
  class_code: string; // Mã lớp: "IA1080"
  subjectName: string; // Tên môn học (alias): "Database Systems"
  status: "Active" | "Archived" | "Completed";

  // Object môn học chi tiết
  subject_id: {
    _id: string;
    name: string; // "Database Systems"
    code: string; // "DB301"
    description: string;
  };

  // Object học kỳ chi tiết
  semester_id: {
    _id: string;
    name: string; // "Spring 2026"
    code: string; // "SP2026"
    start_date: string;
    end_date: string;
    status: string; // "Open"
  };

  // Cấu hình điểm & đóng góp (Dựa trên JSON thực tế)
  contributionConfig: ContributionConfig;
  gradeStructure: GradeColumn[];
}

// 4. Response trả về từ API
export interface LecturerClassesResponse {
  lecturer: {
    _id: string;
    email: string;
    full_name: string;
    avatar_url: string;
  };

  classes: LecturerClassItem[];

  stats: {
    total_classes: number;
    active_classes: number;
    archived_classes: number;
    total_subjects: number;
    total_semesters: number;
  };
}
