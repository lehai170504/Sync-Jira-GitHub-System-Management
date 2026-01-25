export interface StudentProfile {
  _id: string;
  student_code: string;
  full_name: string;
  email: string;
  avatar_url: string;
  major: string;
}

export interface TeamMember {
  _id: string; // Đây là Member ID (dùng để gọi API mapping)
  role_in_team: "Leader" | "Member";
  is_active: boolean;
  jira_account_id: string | null;
  github_username: string | null;
  mapping_status: {
    jira: boolean;
    github: boolean;
  };
  student: StudentProfile;
}

export interface TeamMembersResponse {
  total: number;
  members: TeamMember[];
}

export interface UpdateMappingPayload {
  jira_account_id?: string; // Ví dụ: "94fb9e1e..."
  github_username?: string; // Ví dụ: "lehai170504"
}

// Response trả về từ Server
export interface UpdateMappingResponse {
  message: string; // "Cập nhật mapping thành công!"
  member: TeamMember; // Trả về object member đã update
}
