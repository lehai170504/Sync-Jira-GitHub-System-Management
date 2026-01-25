import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp } from "./firebase-config";

const VAPID_KEY =
  "BJGozyxzCHg3mvgaGcGt3ctD1o3mfTl5_Bu21xG9kkGLEJFL9BX1ESdIYkjeCCAoUHfuYZBlUGcGaTT6xJuAZQM";

/** Kiểm tra có nên gọi getToken không — tránh messaging/permission-blocked khi user chặn thông báo */
function canRequestNotificationToken(): boolean {
  if (typeof window === "undefined" || typeof Notification === "undefined")
    return false;
  const p = Notification.permission;
  return p === "granted" || p === "default";
}

export const requestForToken = async (): Promise<string | null> => {
  if (!canRequestNotificationToken()) return null;

  try {
    const messaging = getMessaging(firebaseApp);
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (currentToken) {
      console.log("FCM Token của bạn:", currentToken);
      return currentToken;
    }
    return null;
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string } | null;
    const code = e?.code ?? "";
    const msg = e?.message ?? "";
    const isPermissionBlocked =
      code === "messaging/permission-blocked" ||
      code === "messaging/permission-default" ||
      /permission.*blocked|blocked.*permission/i.test(msg);
    if (isPermissionBlocked) return null;
    console.error("Lỗi khi lấy FCM Token:", err);
    return null;
  }
};
