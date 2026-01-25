import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignmentApi,
  getClassAssignmentsApi,
} from "../api/assignment-api";
import { CreateAssignmentPayload } from "../types/assignment-types";
import { toast } from "sonner";

// Hook lấy danh sách bài tập
export const useClassAssignments = (
  classId: string | undefined,
  type?: string,
) => {
  return useQuery({
    queryKey: ["lecturer-assignments", classId, type],
    queryFn: () => getClassAssignmentsApi(classId!, type),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
};

// Hook tạo bài tập mới
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) =>
      createAssignmentApi(payload),
    onSuccess: () => {
      toast.success("Tạo bài tập thành công!");
      queryClient.invalidateQueries({ queryKey: ["lecturer-assignments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi tạo bài tập");
    },
  });
};
