import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { disconnectGithubApi } from "../api/github-api";
import { disconnectJiraApi } from "../api/jira-api";

// --- HOOK DISCONNECT GITHUB ---
export const useDisconnectGithub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectGithubApi,
    onSuccess: () => {
      toast.success("Đã ngắt kết nối GitHub thành công!");

      // Xóa lựa chọn repo cũ trong LocalStorage
      localStorage.removeItem("selected_github_repo_id");

      // Cập nhật lại UI ngay lập tức
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Ngắt kết nối thất bại";
      toast.error(msg);
    },
  });
};

// --- HOOK DISCONNECT JIRA ---
export const useDisconnectJira = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectJiraApi,
    onSuccess: () => {
      toast.success("Đã ngắt kết nối Jira thành công!");

      // Cập nhật lại UI
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["jira-projects"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Ngắt kết nối thất bại";
      toast.error(msg);
    },
  });
};
