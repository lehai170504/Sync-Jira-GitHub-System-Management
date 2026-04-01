import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

/** Origin BE (Socket.io không dùng path /api) — khớp Vercel .env NEXT_PUBLIC_API_URL */
const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "https://wdp-be-ama3.onrender.com";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  // Vercel/Render: tránh long-polling (upgrade/polling) — chỉ WebSocket thuần
  transports: ["websocket"],
  withCredentials: true,
  auth: (cb) => {
    const token = Cookies.get("token");
    // Match mobile/Web behavior: backend expects `Bearer <jwt>` style token.
    cb({ token: token ? `Bearer ${token}` : "" });
  },
});
