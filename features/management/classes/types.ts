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
  name: string;
  class_code: string;
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

export interface CreateClassPayload {
  name: string;
  subject_id: string;
  subjectName: string;
  semester_id: string;
  lecturer_id: string;
}

// 👇 CẬP NHẬT FILTER THEO HÌNH ẢNH (image_2696cd.png)
export interface ClassFilters {
  semester_id?: string; // Lọc theo học kỳ
  lecturer_id?: string; // Lọc theo giảng viên
  page?: number;
  limit?: number;
}

export interface ClassStudent {
  _id: string; // ID chính (MongoDB ID)
  student_code: string;
  pending_id?: string; // ID Pending (Có thể null nếu đã Enrolled)
  full_name: string;
  email: string;
  avatar_url?: string;
  team?: string;
  role?: string;
  status: string; // "Enrolled" | "Pending"
}

export interface ClassStudentsResponse {
  total: number;
  enrolled_count: number;
  pending_count: number;
  students: ClassStudent[];
}

export interface ImportStudentDto {
  Class?: string;
  RollNumber: string; // Required based on image description (K19+) or Email (K18-)
  Email: string;
  MemberCode?: string;
  FullName?: string;
  Group?: number | string;
  Leader?: string; // "x" or empty
}

// Payload for the API call
export interface ImportStudentsPayload {
  classId: string; // Path parameter
  students: ImportStudentDto[]; // Body
}

export interface AddStudentPayload {
  classId: string;
  student_code: string;
  full_name: string;
  email: string;
  group: number;
  is_leader?: boolean;
}

// Payload for Deleting Students (DELETE)
export interface RemoveStudentsPayload {
  classId: string;
  student_id: string;
  pending_id: string;
}

// Payload for Updating Students (PUT)
export interface UpdateStudentsPayload {
  classId: string;

  // Body params (theo hình ảnh API Swagger)
  student_id?: string; // Dành cho Enrolled Student
  pending_id?: string; // Dành cho Pending Student
  group?: number; // Số nhóm (VD: 1, 2)
  is_leader?: boolean; // Trạng thái nhóm trưởng
}
