import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  callbackGithubApi,
  getGithubConnectUrlApi,
  GithubCallbackPayload,
} from "../api/github-api";

export const useGithubIntegration = () => {
  const router = useRouter();

  // --- ACTION 1: KẾT NỐI ---
  const connectMutation = useMutation({
    mutationFn: getGithubConnectUrlApi,
    onSuccess: (redirectUrl) => {
      if (redirectUrl && typeof redirectUrl === "string") {
        window.location.href = redirectUrl;
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

  // --- ACTION 2: XÁC THỰC ---
  const verifyGithubMutation = useMutation({
    mutationFn: (payload: GithubCallbackPayload) => callbackGithubApi(payload),
    onSuccess: () => {
      toast.success("Kết nối GitHub thành công!");

      router.refresh();

      router.replace("/config");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Kết nối GitHub thất bại.";
      toast.error(msg);

      // Dù lỗi cũng quay về
      router.replace("/config");
    },
  });

  return {
    connectToGithub: () => connectMutation.mutate(),
    isConnecting: connectMutation.isPending,
    verifyGithub: verifyGithubMutation.mutate,
    isVerifying: verifyGithubMutation.isPending,
  };
};
