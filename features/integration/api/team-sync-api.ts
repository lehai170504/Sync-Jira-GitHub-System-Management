import { axiosClient } from "@/lib/axios-client";

/**
 * Đồng bộ Leader từ Jira Project (khi cần cập nhật Leader thủ công).
 * POST /api/teams/:teamId/sync-leader
 *
 * Khi Jira project 410: BE trả 410 + body { error, jira_project_key }.
 * FE: hiển thị warning, không block UI.
 */
export async function syncLeaderApi(teamId: string): Promise<{ success: true }> {
  const { data } = await axiosClient.post<{ success: true }>(
    `/teams/${teamId}/sync-leader`,
  );
  return data;
}

export interface SyncLeader410Body {
  error: string;
  jira_project_key: string;
}

/** Kiểm tra response lỗi có phải 410 (Jira project không còn tồn tại) không. */
export function isSyncLeader410(err: unknown): err is { response: { status: 410; data: SyncLeader410Body } } {
  const e = err as { response?: { status?: number; data?: SyncLeader410Body } };
  return e?.response?.status === 410 && !!e?.response?.data?.error;
}
