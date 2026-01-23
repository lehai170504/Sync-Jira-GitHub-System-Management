import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSemestersApi,
  createSemesterApi,
  CreateSemesterPayload,
} from "../api/semester-api";

// Hook lấy danh sách
export const useSemesters = () => {
  return useQuery({
    queryKey: ["semesters"],
    queryFn: getSemestersApi,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Hook tạo mới
export const useCreateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSemesterPayload) => createSemesterApi(payload),
    onSuccess: () => {
      toast.success("Tạo học kỳ mới thành công!");
      // Refresh lại danh sách
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi tạo học kỳ.";
      toast.error(msg);
    },
  });
};
