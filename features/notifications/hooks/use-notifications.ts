import { useMutation } from "@tanstack/react-query";
import {
  updateFcmTokenApi,
  sendClassNotificationApi,
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
