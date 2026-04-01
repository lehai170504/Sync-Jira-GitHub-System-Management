import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProjectApi } from "../api/project-api";
import { CreateProjectPayload } from "../types/types";
import { useRouter } from "next/navigation";

/** Gom lỗi từ axios + body NestJS/Express (message: string | string[]) */
function messageFromCreateProjectError(error: unknown): string | undefined {
  const err = error as {
    message?: string;
    response?: { data?: Record<string, unknown>; status?: number };
  };
  const d = err?.response?.data;
  if (!d || typeof d !== "object") {
    if (err?.message && typeof err.message === "string") return err.message;
    return undefined;
  }
  const m = d.message;
  if (typeof m === "string" && m.trim()) return m.trim();
  if (Array.isArray(m) && m.length)
    return m.map((x) => String(x)).join(", ");
  const e = d.error;
  if (typeof e === "string" && e.trim()) return e.trim();
  const errors = d.errors;
  if (Array.isArray(errors) && errors.length)
    return errors.map((x) => String(x)).join(", ");
  return undefined;
}

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
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      const msg =
        messageFromCreateProjectError(error) ||
        (status === 403
          ? "Bạn không có quyền Leader của nhóm này hoặc token hết hạn. Thử đăng nhập lại."
          : status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : undefined) ||
        "Không thể tạo dự án. Vui lòng kiểm tra lại quyền Leader, class/team, hoặc thông tin GitHub/Jira.";
      toast.error(msg);
    },
  });
};
