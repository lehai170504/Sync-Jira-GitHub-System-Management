import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateFcmTokenApi,
  sendClassNotificationApi,
  notificationApi,
} from "../api/notification-api";
import { toast } from "sonner";

export const useUpdateFcmToken = () => {
  return useMutation({
    mutationFn: updateFcmTokenApi,
    onError: () => {
      console.error("Không thể cập nhật FCM Token lên server");
    },
  });
};

export const useSendClassNotification = () => {
  return useMutation({
    mutationFn: sendClassNotificationApi,
    onSuccess: (data: any) => {
      toast.success(data.message || "Gửi thông báo thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi khi gửi thông báo");
    },
  });
};

export const useNotifications = (unreadOnly = false) => {
  return useQuery({
    queryKey: ["notifications", unreadOnly],
    queryFn: () =>
      notificationApi.getNotifications({ unread_only: unreadOnly, limit: 20 }),
    select: (res) => res.data,
  });
};

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // MỚI: Mutation Xóa 1 thông báo
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Đã xóa thông báo");
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa thông báo"),
  });

  // MỚI: Mutation Xóa tất cả thông báo đã đọc
  const clearReadMutation = useMutation({
    mutationFn: () => notificationApi.clearReadNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Đã dọn dẹp các thông báo đã đọc");
    },
    onError: () => toast.error("Có lỗi xảy ra khi dọn dẹp"),
  });

  return {
    markReadMutation,
    markAllReadMutation,
    deleteMutation,
    clearReadMutation,
  };
};
