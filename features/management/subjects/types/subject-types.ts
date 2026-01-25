import { LecturerShort } from "../../semesters/types";

// Kiểu dữ liệu hiển thị (GET)
export interface Subject {
  _id: string;
  code: string; // VD: SWR302
  name: string; // VD: Software Requirement
  description?: string; // VD: Môn học về...
  credits: number; // VD: 3
  status?: "Active" | "Inactive"; // VD: Active
}

// Kiểu dữ liệu gửi lên khi Tạo (POST)
export interface CreateSubjectDto {
  code: string;
  name: string;
  description?: string;
  credits: number;
}

// Response trả về từ API GET list
export interface SubjectListResponse {
  subjects: Subject[];
  total: number;
}

export interface SubjectDetail {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  status: "Active" | "Inactive";
  created_by_admin: {
    _id: string;
    email: string;
    full_name: string;
  };
  created_at: string;
}

export interface ClassInSubject {
  _id: string;
  name: string;
  class_code: string;
  subjectName: string;
  status: string;
  semester_id: {
    _id: string;
    name: string;
    code: string;
    start_date: string;
    end_date: string;
  };
  lecturer_id: LecturerShort | null;
}

export interface SubjectStats {
  total_classes: number;
  active_classes: number;
  archived_classes: number;
  total_lecturers: number;
  total_semesters: number;
}

export interface SubjectDetailResponse {
  subject: SubjectDetail;
  classes: ClassInSubject[];
  stats: SubjectStats;
}
