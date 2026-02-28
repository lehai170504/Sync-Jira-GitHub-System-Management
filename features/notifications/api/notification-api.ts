import { axiosClient } from "@/lib/axios-client";
import { GetNotificationsResponse } from "../types/notification";

// API cập nhật FCM Token cho người dùng
export const updateFcmTokenApi = async (fcm_token: string) => {
  return await axiosClient.post("/users/fcm-token", { fcm_token });
};

// API gửi thông báo cho cả lớp (Dành cho Giảng viên)
export const sendClassNotificationApi = async (data: {
  classId: string;
  title: string;
  message: string;
}) => {
  return await axiosClient.post("/notifications/send-class", data);
};

// API gửi tin nhắn riêng cho 1 sinh viên
export const sendStudentNotificationApi = async (data: {
  studentId: string;
  title: string;
  message: string;
}) => {
  return await axiosClient.post("/notifications/send-student", data);
};

export const notificationApi = {
  // GET: Lấy danh sách thông báo
  getNotifications: (params: {
    limit?: number;
    skip?: number;
    unread_only?: boolean;
  }) =>
    axiosClient.get<GetNotificationsResponse>(
      "/notifications/my-notifications",
      { params },
    ),

  // POST: Đánh dấu 1 thông báo đã đọc
  markAsRead: (notificationId: string) =>
    axiosClient.put(`/notifications/${notificationId}/read`),

  // POST: Đánh dấu tất cả đã đọc
  markAllRead: () => axiosClient.put("/notifications/mark-all-read"),

  // DELETE: Xóa 1 thông báo cụ thể
  deleteNotification: (notificationId: string) =>
    axiosClient.delete(`/notifications/${notificationId}`),

  // DELETE: Xóa tất cả thông báo ĐÃ ĐỌC
  clearReadNotifications: () => axiosClient.delete("/notifications/clear-read"),
};
