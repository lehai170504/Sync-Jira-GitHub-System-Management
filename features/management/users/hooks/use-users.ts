import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUsersApi, createUserApi } from "../api/user-api";
import { UserFilters, CreateUserPayload } from "../types";

// Hook lấy danh sách (Query)
export const useUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsersApi(filters),
    staleTime: 1 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

// Hook tạo user (Mutation)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUserApi(payload),
    onSuccess: () => {
      toast.success("Tạo người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi tạo người dùng";
      toast.error(msg);
    },
  });
};
