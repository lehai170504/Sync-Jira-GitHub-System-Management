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
