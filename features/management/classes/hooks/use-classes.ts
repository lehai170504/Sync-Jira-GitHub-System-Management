import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClassesApi, createClassApi } from "../api/class-api";
import { ClassFilters, CreateClassPayload } from "../types";

// Hook lấy danh sách lớp (Query)
export const useClasses = (filters: ClassFilters) => {
  return useQuery({
    queryKey: ["classes", filters],
    queryFn: () => getClassesApi(filters),

    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

// Hook tạo lớp học (Mutation)
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassPayload) => createClassApi(payload),
    onSuccess: () => {
      toast.success("Tạo lớp học thành công!");

      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi tạo lớp học";
      toast.error(msg);
    },
  });
};
