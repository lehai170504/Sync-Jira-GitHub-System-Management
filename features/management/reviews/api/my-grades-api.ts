import { axiosClient } from "@/lib/axios-client";

export interface MyGradeAssignment {
  assignment_name: string;
  group_grade: number;
  jira_percentage: number;
  git_percentage: number;
  review_percentage: number;
  contribution_factor: number;
  final_score: number;
  updated_at: string;
}

export interface MyGradesResponse {
  message: string;
  total_assignments: number;
  data: MyGradeAssignment[];
}

/**
 * GET /reviews/teams/{teamId}/my-grades
 */
export async function getMyGradesApi(teamId: string): Promise<MyGradesResponse> {
  const { data } = await axiosClient.get<MyGradesResponse>(
    `/reviews/teams/${encodeURIComponent(teamId)}/my-grades`,
  );
  return data;
}

