import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Với SSR, ta nên set staleTime > 0 để tránh việc client fetch lại
        // ngay lập tức dữ liệu mà server vừa prefetch xong.
        staleTime: 60 * 1000, // 1 phút
        // refetchOnWindowFocus: false, // Tùy chọn: tắt tự động fetch khi focus tab
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: Luôn tạo client mới cho mỗi request
    return makeQueryClient();
  } else {
    // Client: Tạo 1 lần duy nhất (Singleton)
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
