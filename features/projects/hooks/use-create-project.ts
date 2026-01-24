import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProjectApi } from "../api/project-api";
import { CreateProjectPayload } from "../types";
import { useRouter } from "next/navigation";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProjectApi(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Tạo dự án thành công!");

      // Refresh lại danh sách project hoặc thông tin nhóm nếu cần
      queryClient.invalidateQueries({ queryKey: ["my-project"] });

      router.push("/dashboard");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        "Không thể tạo dự án. Vui lòng kiểm tra lại quyền Leader hoặc thông tin nhóm.";
      toast.error(msg);
    },
  });
};
