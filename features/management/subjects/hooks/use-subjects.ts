import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSubjectsApi, createSubjectApi } from "../api/subject-api";
import { CreateSubjectDto } from "../types/subject-types.ts";

// --- Hook Lấy danh sách (GET) ---
export const useSubjects = (status: string = "Active") => {
  return useQuery({
    queryKey: ["subjects", status],
    queryFn: () => getSubjectsApi({ status }),
  });
};

// --- Hook Thao tác (POST) ---
export const useSubjectMutations = () => {
  const queryClient = useQueryClient();

  // Tạo mới
  const createMutation = useMutation({
    mutationFn: (data: CreateSubjectDto) => createSubjectApi(data),
    onSuccess: () => {
      toast.success("Tạo môn học thành công!");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Tạo thất bại");
    },
  });

  return {
    createSubject: createMutation.mutateAsync,
    isPending: createMutation.isPending,
  };
};
