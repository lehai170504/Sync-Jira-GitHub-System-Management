export type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

export type RegisterFormData = {
  email: string;
  otp: string;
  fullName: string;
  studentCode: string;
  avatarUrl: string;
  password: string;
  confirmPassword: string;
  role: "STUDENT" | "LECTURER";
};

export interface User {
  _id: string;
  email: string;
  full_name: string;
  role: UserRole;

  // Thông tin bổ sung (Optional vì không phải user nào cũng có hoặc API có thể trả về null)
  avatar_url?: string;
  is_verified?: boolean;

  // Các trường đặc thù cho Sinh viên / Giảng viên
  student_code?: string; // Mã số sinh viên / Mã giảng viên
  major?: string; // Chuyên ngành (VD: SE, GD...)
  ent?: string; // Khóa học (VD: K18) - Dựa trên response thực tế

  // Timestamp
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginError {
  error: string;
  requires_verification?: boolean;
}
