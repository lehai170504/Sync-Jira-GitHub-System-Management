import { axiosClient } from "@/lib/axios-client";

export interface UserProfile {
  user: {
    _id: string; // Backend trả về _id
    id?: string; // Giữ lại id cho tương thích ngược nếu cần
    email: string;
    full_name: string;
    student_code: string;
    role: string;
    avatar_url: string;
    major?: string;
    ent?: string;
    created_at: string;
    updated_at?: string;
    is_verified: boolean;
    integrations?: {
      github?: {
        githubId: string;
        username: string;
        linkedAt: string;
        accessToken?: string;
      };
      jira?: {
        jiraAccountId: string;
        cloudId: string;
        email: string;
        linkedAt: string;
        accessToken?: string;
        refreshToken?: string;
      };
    };
  };
}

export interface UpdateProfilePayload {
  full_name?: string;
  major?: string;
  ent?: string;
  avatar_url?: string;
}

export const getUserProfileApi = async (): Promise<UserProfile> => {
  const { data } = await axiosClient.get("/auth/me");
  return data;
};

export const updateProfileApi = async (payload: UpdateProfilePayload) => {
  const { data } = await axiosClient.put("/auth/me", payload);
  return data;
};
