import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  syncLeaderApi,
  isSyncLeader410,
  type SyncLeader410Body,
} from "../api/team-sync-api";

/**
 * Gọi sync-leader; khi 410 (Jira project không còn tồn tại): warning, không block.
 */
export function useSyncLeader(teamId: string | undefined) {
  return useMutation({
    mutationFn: () => {
      if (!teamId) throw new Error("Chưa chọn team.");
      return syncLeaderApi(teamId);
    },
    onSuccess: () => {
      toast.success("Đã đồng bộ Leader từ Jira.");
    },
    onError: (err: unknown) => {
      if (isSyncLeader410(err)) {
        const body = (err as { response: { data: SyncLeader410Body } }).response.data;
        toast.warning("Jira project không còn tồn tại", {
          description: body?.error ?? "Vui lòng kiểm tra lại Jira Project Key.",
        });
        return;
      }
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Không thể đồng bộ Leader từ Jira.";
      toast.error(msg);
    },
  });
}
