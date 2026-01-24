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

// Biến cờ để kiểm tra xem có đang refresh token không
let isRefreshing = false;
// Hàng đợi lưu các request bị lỗi để chạy lại sau khi refresh xong
let failedQueue: any[] = [];

// Hàm xử lý hàng đợi
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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Unauthorized) và request chưa từng được retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang có một tiến trình refresh token chạy rồi
      if (isRefreshing) {
        // Đẩy request này vào hàng đợi, đợi khi nào có token mới thì chạy lại
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

      // Đánh dấu request này đã được retry để tránh lặp vô tận
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 1. Lấy Refresh Token từ Cookie
        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // 2. Gọi API làm mới token
        const data = await refreshTokenApi(refreshToken);

        // 3. Lưu Token mới vào Cookie
        // (Lưu ý: set lại thời gian hết hạn phù hợp với BE trả về)
        Cookies.set("token", data.access_token, { expires: 1 });
        Cookies.set("refreshToken", data.refresh_token, { expires: 7 });

        // 4. Gắn token mới vào header của request ban đầu
        axiosClient.defaults.headers.common["Authorization"] =
          "Bearer " + data.access_token;
        originalRequest.headers["Authorization"] =
          "Bearer " + data.access_token;

        // 5. Giải quyết hàng đợi (cho các request khác đang chờ)
        processQueue(null, data.access_token);

        // 6. Gọi lại request ban đầu
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu Refresh Token cũng hết hạn hoặc lỗi -> Logout bắt buộc
        processQueue(refreshError, null);

        // Xóa sạch dữ liệu
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("user_role");
        Cookies.remove("user_email");
        Cookies.remove("user_name");

        // Bắn sự kiện logout cho các tab khác
        if (typeof window !== "undefined") {
          localStorage.setItem("logout_event", Date.now().toString());
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
