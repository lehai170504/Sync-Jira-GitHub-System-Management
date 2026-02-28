// @/features/notifications/types/notification.ts

export type NotificationType = "task" | "review" | "system";

export interface NotificationUser {
  full_name: string;
  avatar_url?: string;
  email: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string; // Tương ứng với 'desc' trong UI cũ
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  user?: NotificationUser; // User gây ra thông báo (nếu có)
}

export interface GetNotificationsResponse {
  notifications: NotificationItem[];
  unread: number;
  total: number;
}
