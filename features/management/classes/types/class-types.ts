// features/management/classes/types/class-types.ts

// ==========================================
// 1. SUB-INTERFACES (Các object con)
// ==========================================

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

export interface GradeStructureItem {
  _id: string;
  name: string;
  weight: number;
  isGroupGrade: boolean;
}

// ==========================================
// 2. CLASS TYPE (Dùng cho List)
// ==========================================

export interface Class {
  _id: string;
  name: string; // VD: SE1943-A
  class_code: string; // VD: SE1943-A
  subjectName: string; // VD: Software Engineering Project
  status: "Active" | "Finished" | string;

  // subject_id: string; // Chỉ trả về string ID trong list
  subject_id: string | null; // Cập nhật theo response mẫu (có thể null hoặc string ID)

  semester_id: SemesterInfo;
  lecturer_id: LecturerInfo | null; // Có thể null

  contributionConfig: ContributionConfig;
  gradeStructure: GradeStructureItem[]; // Mảng grade structure

  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Response trả về từ API lấy danh sách
export interface ClassListResponse {
  total: number;
  classes: Class[];
}

// ==========================================
// 3. TYPES CHO FILTER & CREATE (Giữ nguyên)
// ==========================================

export interface CreateClassPayload {
  name: string;
  subject_id: string;
  subjectName: string;
  semester_id: string;
  lecturer_id: string;
}

export interface ClassFilters {
  semester_id?: string;
  lecturer_id?: string;
  page?: number;
  limit?: number;
}

// ==========================================
// 4. STUDENT TYPES (Giữ nguyên)
// ==========================================

export interface ClassStudent {
  _id: string;
  student_code: string;
  pending_id?: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  team?: string;
  role?: string;
  status: string;
}

export interface ClassStudentsResponse {
  total: number;
  enrolled_count: number;
  pending_count: number;
  students: ClassStudent[];
}

export interface ImportStudentDto {
  Class?: string;
  RollNumber: string;
  Email: string;
  MemberCode?: string;
  FullName?: string;
  Group?: number | string;
  Leader?: string;
}

export interface ImportStudentsPayload {
  classId: string;
  students: ImportStudentDto[];
}

export interface AddStudentPayload {
  classId: string;
  student_code: string;
  full_name: string;
  email: string;
  group: number;
  is_leader?: boolean;
}

export interface RemoveStudentsPayload {
  classId: string;
  student_id: string;
  pending_id: string;
}

export interface UpdateStudentsPayload {
  classId: string;
  student_id?: string;
  pending_id?: string;
  group?: number;
  is_leader?: boolean;
}
