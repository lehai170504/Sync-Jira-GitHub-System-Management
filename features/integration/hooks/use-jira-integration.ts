import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getJiraConnectUrlApi } from "../api/jira-api";

export const useJiraIntegration = () => {
  // --- ACTION 1: KẾT NỐI (Chỉ cần hàm này) ---
  const connectMutation = useMutation({
    mutationFn: getJiraConnectUrlApi,
    onSuccess: (redirectUrl) => {
      if (redirectUrl && typeof redirectUrl === "string") {
        // Lưu flag (option này để phân biệt nếu cần, giờ có thể không cần thiết lắm nhưng cứ giữ cho chắc)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("connecting_service", "jira");
        }
        // Chuyển hướng sang Atlassian
        window.location.href = redirectUrl;
      } else {
        toast.error("URL kết nối Jira không hợp lệ");
      }
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Không thể lấy link kết nối Jira";
      toast.error(msg);
    },
  });

  return {
    connectToJira: () => connectMutation.mutate(),
    isConnecting: connectMutation.isPending,
  };
};
