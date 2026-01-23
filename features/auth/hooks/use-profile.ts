import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProfileApi,
  updateProfileApi,
  UpdateProfilePayload,
} from "../api/profile-api";

// --- GET PROFILE ---
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
  });
};

// --- UPDATE PROFILE ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateProfileApi(data),
    onSuccess: (data) => {
      toast.success("Cập nhật hồ sơ thành công!");

      queryClient.setQueryData(["profile"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          user: data.user || oldData.user,
        };
      });

      // Hoặc chắc chắn hơn thì invalidate để fetch lại từ server
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Cập nhật thất bại.";
      toast.error(msg);
    },
  });
};
