import axios from "axios";
import Cookies from "js-cookie";
import { refreshTokenApi } from "@/features/auth/api/refresh-token-api";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// --- 1. REQUEST INTERCEPTOR (Gửi token đi) ---
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 2. RESPONSE INTERCEPTOR (Xử lý khi Token hết hạn) ---

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Hàm tiện ích: Xóa sạch dữ liệu và ép văng về trang chủ ("/")
const forceLogout = () => {
  const opt = { path: "/" as const };
  Cookies.remove("token", opt);
  Cookies.remove("refreshToken", opt);
  Cookies.remove("user_role", opt);
  Cookies.remove("user_email", opt);
  Cookies.remove("user_name", opt);

  if (typeof window !== "undefined") {
    localStorage.setItem("logout_event", Date.now().toString());
    // Đảm bảo chỉ redirect nếu chưa ở trang "/"
    if (window.location.pathname !== "/") {
      window.location.href = "/login";
    }
  }
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Unauthorized) và request chưa từng được retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        // 🚨 NẾU KHÔNG CÓ REFRESH TOKEN -> CHƯA ĐĂNG NHẬP HOẶC MẤT PHIÊN -> ĐÁ VỀ "/"
        if (!refreshToken) {
          forceLogout();
          return Promise.reject(new Error("No refresh token available"));
        }

        // Gọi API làm mới token
        const data = await refreshTokenApi(refreshToken);

        // Lưu Token mới vào Cookie
        Cookies.set("token", data.access_token, { path: "/", expires: 1 });
        Cookies.set("refreshToken", data.refresh_token, {
          path: "/",
          expires: 7,
        });

        axiosClient.defaults.headers.common["Authorization"] =
          "Bearer " + data.access_token;
        originalRequest.headers["Authorization"] =
          "Bearer " + data.access_token;

        processQueue(null, data.access_token);

        return axiosClient(originalRequest);
      } catch (refreshError) {
        // 🚨 NẾU REFRESH TOKEN CŨNG HẾT HẠN HOẶC LỖI -> ĐÁ VỀ "/"
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 🚨 QUAN TRỌNG: Nếu lỗi 401 xảy ra ở bất kỳ đâu khác (VD: gọi api retry vẫn 401) -> Bắt buộc Logout
    if (error.response?.status === 401) {
      forceLogout();
    }

    return Promise.reject(error);
  }
);
