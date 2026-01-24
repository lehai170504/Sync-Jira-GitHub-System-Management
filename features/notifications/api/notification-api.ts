import { axiosClient } from "@/lib/axios-client";

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
