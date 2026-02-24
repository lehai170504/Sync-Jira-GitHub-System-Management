import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGithubConnectUrlApi } from "../api/github-api";

export const useGithubIntegration = () => {
  // --- ACTION: LẤY URL VÀ MỞ POPUP KẾT NỐI ---
  const connectMutation = useMutation({
    mutationFn: getGithubConnectUrlApi,
    onSuccess: (redirectUrl) => {
      if (redirectUrl && typeof redirectUrl === "string") {
        // Cấu hình mở Popup ở giữa màn hình
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
          redirectUrl,
          "GithubOAuthPopup",
          `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no`,
        );
      } else {
        toast.error("URL kết nối không hợp lệ từ Server");
      }
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Không thể lấy link kết nối GitHub";
      toast.error(msg);
    },
  });

  return {
    connectToGithub: () => connectMutation.mutate(),
    isConnecting: connectMutation.isPending,
  };
};
