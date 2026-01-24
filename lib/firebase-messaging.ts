import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp } from "./firebase-config";

export const requestForToken = async () => {
  try {
    const messaging = getMessaging(firebaseApp);

    // Lấy token từ Firebase SDK
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BJGozyxzCHg3mvgaGcGt3ctD1o3mfTl5_Bu21xG9kkGLEJFL9BX1ESdIYkjeCCAoUHfuYZBlUGcGaTT6xJuAZQM",
    });

    if (currentToken) {
      console.log("FCM Token của bạn:", currentToken);
      return currentToken;
    } else {
      console.warn("Người dùng không cấp quyền thông báo.");
      return null;
    }
  } catch (err) {
    console.error("Lỗi khi lấy FCM Token:", err);
    return null;
  }
};
