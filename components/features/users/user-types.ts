export type UserRole = "LECTURER" | "MEMBER";
export type UserStatus = "Active" | "Reserved" | "Dropped";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  code: string;
  avatar: string;
}
