import { axiosClient } from "@/lib/axios-client";
import {
  TaskItem,
  sortTasksByStatus,
} from "@/features/management/teams/api/task-api";

/**
 * Member task item từ API GET /integrations/team/{teamId}/tasks
 */
export interface MemberTaskItem {
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
 * Response từ API GET /integrations/team/{teamId}/tasks
 */
export interface TeamAllTasksResponse {
  team: {
    _id: string;
    project_name: string;
  };
  summary: {
    total_members: number;
    total_tasks: number;
  };
  members_tasks: MemberTaskItem[];
}

/**
 * GET /integrations/team/{teamId}/tasks
 * Lấy danh sách tasks của tất cả thành viên trong team, được group theo member
 */
export const getTeamAllTasksApi = async (
  teamId: string
): Promise<TeamAllTasksResponse> => {
  const { data } = await axiosClient.get<TeamAllTasksResponse>(
    `/integrations/team/${teamId}/tasks`
  );
  if (!data?.members_tasks) return data;
  return {
    ...data,
    members_tasks: data.members_tasks.map((mt) => ({
      ...mt,
      tasks: sortTasksByStatus(Array.isArray(mt.tasks) ? mt.tasks : []),
    })),
  };
};
