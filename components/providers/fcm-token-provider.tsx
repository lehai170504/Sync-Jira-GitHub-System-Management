"use client";

import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/lib/firebase-config";
import { requestForToken } from "@/lib/firebase-messaging";
import { updateFcmTokenApi } from "@/features/notifications/api/notification-api";
import { toast } from "sonner";
import Cookies from "js-cookie";

/** Push notification là tùy chọn — không chạy FCM khi user đã chặn quyền. */
function canUseFCM(): boolean {
  if (typeof window === "undefined" || typeof Notification === "undefined")
    return false;
  return (
    Notification.permission === "granted" ||
    Notification.permission === "default"
  );
}

export const FCMTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const hasAuth = Cookies.get("token");
    if (!hasAuth) return;

    const run = async () => {
      try {
        const fcmToken = await requestForToken();
        if (fcmToken) {
          await updateFcmTokenApi(fcmToken);
          console.log("✅ FCM Token đã được đồng bộ ngầm.");
        }
      } catch (e) {
        console.warn("⚠️ Đồng bộ FCM ngầm thất bại:", e);
      }
    };

    if (canUseFCM()) run();

    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      canUseFCM()
    ) {
      try {
        const messaging = getMessaging(firebaseApp);
        const unsubscribe = onMessage(messaging, (payload) => {
          toast.info(payload.notification?.title || "Thông báo mới", {
            description: payload.notification?.body,
            duration: 8000,
            position: "top-right",
          });
        });
        return () => unsubscribe();
      } catch (e) {
        console.warn("⚠️ FCM foreground listener setup failed:", e);
      }
    }
  }, []);

  return <>{children}</>;
};
