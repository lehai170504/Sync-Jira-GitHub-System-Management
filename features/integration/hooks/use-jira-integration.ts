import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getJiraConnectUrlApi } from "../api/jira-api";

export const useJiraIntegration = () => {
  // --- ACTION: LẤY URL VÀ MỞ POPUP KẾT NỐI ---
  const connectMutation = useMutation({
    mutationFn: getJiraConnectUrlApi,
    onSuccess: (redirectUrl) => {
      if (redirectUrl && typeof redirectUrl === "string") {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("connecting_service", "jira");
        }

        // Cấu hình mở Popup ở giữa màn hình
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
          redirectUrl,
          "JiraOAuthPopup",
          `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no`,
        );
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
