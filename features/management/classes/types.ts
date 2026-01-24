// Định nghĩa các sub-interface cho gọn
export interface SemesterInfo {
  _id: string;
  name: string;
  code: string;
}

export interface LecturerInfo {
  _id: string;
  email: string;
  full_name: string;
}

export interface ContributionConfig {
  jiraWeight: number;
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean;
}

export interface Class {
  _id: string;
  name: string; // VD: "SE1943-A"
  class_code: string; // VD: "SE1943-A"
  subjectName: string;
  subject_id: string | null;
  status: "Active" | "Finished" | string;
  semester_id: SemesterInfo;
  lecturer_id: LecturerInfo;

  contributionConfig?: ContributionConfig;
  gradeStructure?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassResponse {
  total: number;
  classes: Class[];
}

// 👇 CẬP NHẬT PAYLOAD THEO HÌNH ẢNH
export interface CreateClassPayload {
  name: string; // VD: Software Engineering Project - Class 1
  subject_id: string; // ID môn học
  subjectName: string; // Tên môn học (BE yêu cầu gửi kèm)
  semester_id: string;
  lecturer_id: string;
}

export interface ClassFilters {
  semester_id?: string;
  page?: number;
  limit?: number;
}
