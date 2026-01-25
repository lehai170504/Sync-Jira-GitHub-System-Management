import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = "https://wdp-be-ama3.onrender.com";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  transports: ["websocket"],
  upgrade: false,
  auth: (cb) => {
    cb({ token: Cookies.get("token") });
  },
});
