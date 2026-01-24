"use client";

import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/lib/firebase-config";
import { requestForToken } from "@/lib/firebase-messaging";
import { updateFcmTokenApi } from "@/features/notifications/api/notification-api";
import { toast } from "sonner";
import Cookies from "js-cookie";

export const FCMTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const handleBackgroundSync = async () => {
      // 1. Kiểm tra xem user có token chưa (đã đăng nhập)
      const hasAuth = Cookies.get("token");
      if (!hasAuth) return;

      try {
        // 2. Lấy FCM Token (nếu user chưa cho phép, trình duyệt sẽ hiện popup ở đây)
        const fcmToken = await requestForToken();
        if (fcmToken) {
          // 3. Cập nhật lên server ngầm
          await updateFcmTokenApi(fcmToken);
          console.log("✅ FCM Token đã được đồng bộ ngầm.");
        }
      } catch (error) {
        console.warn("⚠️ Đồng bộ FCM ngầm thất bại:", error);
      }
    };

    handleBackgroundSync();

    // 4. Lắng nghe thông báo Foreground (Khi đang mở web)
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        toast.info(payload.notification?.title || "Thông báo mới", {
          description: payload.notification?.body,
          duration: 8000,
          position: "top-right",
        });
      });
      return () => unsubscribe();
    }
  }, []);

  return <>{children}</>;
};
