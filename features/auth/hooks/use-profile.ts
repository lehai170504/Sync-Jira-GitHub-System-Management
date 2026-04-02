import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
// Import từ file API user-api mà chúng ta đã thống nhất
import {
  getUserProfileApi,
  updateProfileApi,
  UpdateProfilePayload,
  UserProfile,
} from "../api/profile-api";
import axios from "axios";

// --- GET PROFILE ---
export const useProfile = () => {
  const hasToken = !!Cookies.get("token");
  return useQuery({
    // 👇 QUAN TRỌNG: Đổi key thành "user-profile" để khớp với GithubFormLeader
    queryKey: ["user-profile"],
    queryFn: getUserProfileApi,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 phút (Cache)
    retry: (failureCount, err) => {
      if (axios.isAxiosError(err)) {
        const s = err.response?.status;
        if (s === 502 || s === 503 || s === 504) return failureCount < 5;
        if (!err.response) return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attempt) => Math.min(5000 * (attempt + 1), 25000),
    // Khi user focus lại vào tab, fetch lại để cập nhật trạng thái kết nối mới nhất
    refetchOnWindowFocus: true,
  });
};

// --- UPDATE PROFILE ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateProfileApi(data),
    onSuccess: (newData) => {
      toast.success("Cập nhật hồ sơ thành công!");

      // Cập nhật Cache thủ công (Optimistic UI) để UI đổi ngay lập tức
      queryClient.setQueryData<UserProfile>(["user-profile"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          user: {
            ...oldData.user,
            ...newData.user, // Merge thông tin mới update vào
          },
        };
      });

      // 👇 QUAN TRỌNG: Invalidate để đảm bảo dữ liệu đồng bộ với Server
      // (Ví dụ: tên user đổi -> avatar trên header đổi theo)
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Cập nhật thất bại.";
      toast.error(msg);
    },
  });
};
