"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/features/auth/hooks/use-profile";

interface SocketContextType {
  isConnected: boolean;
  socket: typeof socket;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: socket,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const token = Cookies.get("token");
  const queryClient = useQueryClient();

  const { data: profileData } = useProfile();
  const userId = profileData?.user?._id;

  useEffect(() => {
    if (!token) {
      if (socket.connected) socket.disconnect();
      return;
    }

    socket.auth = { token };
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      console.log("🌐 Socket Connected!");

      if (userId) {
        socket.emit("join_user", userId);
        console.log(`👤 Đã join socket room với User ID: ${userId}`);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("🌐 Socket Disconnected!");
    }

    function onConnectError(err: any) {
      console.error("❌ Socket Auth Error:", err.message);
      if (err.message === "Authentication error") {
        socket.auth = { token: Cookies.get("token") };
        socket.connect();
      }
    }

    function onSystemNotification(data: any) {
      toast.info(data.title || "Thông báo hệ thống", {
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }

    // Lắng nghe thông báo cá nhân mới và cập nhật UI (chuông, badge)
    function onNewNotification(data: any) {
      console.log("🔔 Có thông báo cá nhân mới:", data);
      toast.success(data?.title || "Bạn có thông báo mới!");

      // Lệnh này sẽ làm chuông tự động nảy số (cập nhật unread count)
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("system_notification", onSystemNotification);
    socket.on("new_notification", onNewNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("system_notification", onSystemNotification);
      socket.off("new_notification", onNewNotification);
      socket.disconnect();
    };
  }, [token, queryClient, userId]); // <-- Thêm userId vào dependency array

  // Xử lý case: nếu socket đã connect trước khi API profile trả về userId
  useEffect(() => {
    if (isConnected && userId) {
      socket.emit("join_user", userId);
      console.log(`👤 Bổ sung join_user sau khi có data: ${userId}`);
    }
  }, [isConnected, userId]);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
