import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProjectApi } from "../api/project-api";
import { CreateProjectPayload } from "../types/types";
import { useRouter } from "next/navigation";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProjectApi(payload),
    onSuccess: async (data) => {
      toast.success(data.message || "Tạo dự án thành công!");

      // Đợi refetch my-project xong rồi mới navigate để /project và /class thấy dữ liệu mới
      await queryClient.refetchQueries({ queryKey: ["my-project"] });

      router.push("/project");
    },
    onError: (error: any) => {
      const res = error.response?.data;
      const msg =
        res?.message ||
        (Array.isArray(res?.errors) ? res.errors.join(", ") : undefined) ||
        "Không thể tạo dự án. Vui lòng kiểm tra lại quyền Leader hoặc thông tin nhóm.";
      toast.error(msg);
    },
  });
};
