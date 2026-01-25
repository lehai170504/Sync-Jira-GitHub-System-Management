// features/management/lecturers/types/lecturer-classes-types.ts

// 1. Cấu hình trọng số đóng góp (Jira/Git/Review)
export interface ContributionConfig {
  jiraWeight: number; // VD: 0.4
  gitWeight: number; // VD: 0.4
  reviewWeight: number; // VD: 0.2
  allowOverCeiling: boolean; // VD: false
}

// 2. Cấu trúc điểm số (Assignments, Final,...)
export interface GradeColumn {
  _id: string;
  name: string; // VD: "Assignment 1"
  weight: number; // VD: 0.2
  isGroupGrade: boolean; // VD: false
}

// 3. Thông tin chi tiết một lớp học
export interface LecturerClassItem {
  _id: string;
  name: string; // VD: "IA1080"
  class_code: string; // VD: "IA1080"
  subjectName: string; // VD: "Database Systems"
  status: "Active" | "Archived" | "Completed"; // VD: "Active"

  // Object môn học
  subject_id: {
    _id: string;
    name: string; // VD: "Database Systems"
    code: string; // VD: "DB301"
    description: string;
  };

  // Object học kỳ
  semester_id: {
    _id: string;
    name: string; // VD: "Spring 2026"
    code: string; // VD: "SP2026"
    start_date: string; // VD: "2026-01-15T00:00:00.000Z"
    end_date: string; // VD: "2026-05-15T00:00:00.000Z"
    status: string; // VD: "Open"
  };

  // Cấu hình điểm & đóng góp
  contributionConfig?: ContributionConfig;
  gradeStructure?: GradeColumn[];
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
