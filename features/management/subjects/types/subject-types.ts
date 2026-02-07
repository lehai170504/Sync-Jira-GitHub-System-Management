// features/management/subjects/types.ts

// ==========================================
// 1. SUB-TYPES (DÙNG CHUNG CHO TOÀN BỘ)
// ==========================================

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

export interface SemesterShort {
  _id: string;
  name: string;
  code: string;
  start_date: string; // ISO Date
  end_date: string; // ISO Date
}

// ==========================================
// 2. TYPES CHO VIỆC TẠO MỚI (CREATE / FORM)
// ==========================================

// Dữ liệu gửi lên khi tạo môn học
export interface CreateSubjectDto {
  code: string;
  name: string;
  description?: string;
  credits: number;
}

// ==========================================
// 3. TYPES CHO DANH SÁCH (LIST / TABLE)
// ==========================================

// Object môn học hiển thị ở bảng danh sách (nhẹ hơn detail)
export interface Subject {
  _id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  status: "Active" | "Inactive";
  created_at?: string;
}

// Response trả về từ API lấy danh sách
export interface SubjectListResponse {
  subjects: Subject[];
  total: number;
}

// ==========================================
// 4. TYPES CHO CHI TIẾT (DETAIL / DRAWER)
// ==========================================

// Chi tiết Môn học (Đầy đủ thông tin người tạo, timestamps...)
export interface SubjectDetail {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  status: "Active" | "Inactive";
  created_by_admin?: AdminShort;
  created_at: string;
  updatedAt?: string;
  __v?: number;
}

// Chi tiết Lớp trong Môn học (Kèm thông tin học kỳ & giảng viên)
export interface ClassInSubject {
  _id: string;
  name: string; // VD: IA1080
  class_code: string;
  subjectName: string;
  status: string; // VD: Active
  semester_id: SemesterShort; // Thông tin học kỳ
  lecturer_id: LecturerShort | null; // Giảng viên
}

// Thống kê liên quan đến môn học
export interface SubjectStats {
  total_classes: number;
  active_classes: number;
  archived_classes: number;
  total_lecturers: number;
  total_semesters: number;
}

// Response tổng hợp cho API Detail
export interface SubjectDetailResponse {
  subject: SubjectDetail;
  classes: ClassInSubject[];
  stats: SubjectStats;
}
