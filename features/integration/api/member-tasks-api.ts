import { axiosClient } from "@/lib/axios-client";
import { TaskItem } from "@/features/management/teams/api/task-api";

/**
 * Response từ API GET /integrations/team/{teamId}/member/{memberId}/tasks
 */
export interface MemberTasksResponse {
  member: {
    _id: string;
    student: {
      _id: string;
      student_code: string;
      email: string;
      full_name: string;
    } | null;
    role_in_team: string;
    jira_account_id: string | null;
  };
  total: number;
  tasks: TaskItem[];
}

/**
 * GET /integrations/team/{teamId}/member/{memberId}/tasks
 * Lấy danh sách tasks của một thành viên cụ thể trong team
 */
export const getMemberTasksApi = async (
  teamId: string,
  memberId: string
): Promise<TaskItem[]> => {
  const { data } = await axiosClient.get<MemberTasksResponse>(
    `/integrations/team/${teamId}/member/${memberId}/tasks`
  );
  // Chỉ trả về tasks array, giống như getTasksApi
  return data.tasks;
};
