"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import Cookies from "js-cookie";
import { toast } from "sonner";

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
  const token = Cookies.get("token"); // Lấy token để theo dõi thay đổi

  useEffect(() => {
    if (!token) {
      if (socket.connected) socket.disconnect();
      return;
    }

    // 1. Kết nối thủ công
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      console.log("🌐 Socket Connected!");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("🌐 Socket Disconnected!");
    }

    // 2. Xử lý lỗi Token hết hạn hoặc sai
    function onConnectError(err: any) {
      console.error("❌ Socket Auth Error:", err.message);
      if (err.message === "Authentication error") {
        // Cập nhật lại token mới nhất từ cookie cho lần thử sau
        socket.auth = { token: Cookies.get("token") };
      }
    }

    function onSystemNotification(data: any) {
      toast.info(data.title || "Thông báo hệ thống", {
        description: data.message,
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("system_notification", onSystemNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("system_notification", onSystemNotification);
      socket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
