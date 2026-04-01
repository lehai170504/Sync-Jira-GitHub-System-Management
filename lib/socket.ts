import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

/** Origin BE (Socket.io không dùng path /api) — khớp Vercel .env NEXT_PUBLIC_API_URL */
const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "https://wdp-be-ama3.onrender.com";

export const socket: Socket = io(SOCKET_URL, {
  path: "/socket.io",
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  // Khớp BE + Capacitor/WebView (polling → upgrade websocket). Nếu môi trường chặt chỉ WS, có thể đổi thành ["websocket"].
  transports: ["polling", "websocket"],
  withCredentials: true,
  auth: (cb) => {
    const token = Cookies.get("token");
    // Match mobile/Web behavior: backend expects `Bearer <jwt>` style token.
    cb({ token: token ? `Bearer ${token}` : "" });
  },
});
