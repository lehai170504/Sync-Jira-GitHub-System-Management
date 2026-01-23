export type UserRole = "LECTURER" | "MEMBER" | "ADMIN";
export type UserStatus = "Active" | "Reserved" | "Dropped"; // Giả định backend sẽ trả về field này hoặc ta cần map

export interface User {
  _id: string;
  email: string;
  full_name: string;
  role: UserRole;
  student_code?: string;
  avatar_url?: string;
  status?: UserStatus;
  created_at?: string;
}

export interface UserResponse {
  total: number;
  users: User[];
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string; // "LECTURER" | "MEMBER" | ""
  search?: string;
}

export interface CreateUserPayload {
  full_name: string;
  email: string;
  role: UserRole;
}
