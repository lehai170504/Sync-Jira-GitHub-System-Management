// src/features/auth/hooks/use-logout.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { logoutApi } from "../api/logout-api";

export const useLogout = () => {
  const router = useRouter();

  const cookieOpt = { path: "/" as const };

  const handleClientLogout = () => {
    Cookies.remove("token", cookieOpt);
    Cookies.remove("refreshToken", cookieOpt);
    Cookies.remove("user_role", cookieOpt);
    Cookies.remove("user_email", cookieOpt);
    Cookies.remove("user_name", cookieOpt);
    Cookies.remove("user_avatar", cookieOpt);

    localStorage.setItem("logout_event", Date.now().toString());
    router.push("/login");
    router.refresh();
  };

  return useMutation({
    // --- FIX TẠI ĐÂY ---
    mutationFn: async () => {
      const refreshToken = Cookies.get("refreshToken");

      // Nếu không có refresh token, dừng hàm (trả về void)
      if (!refreshToken) {
        return;
      }

      await logoutApi(refreshToken);
    },
    // -------------------
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      handleClientLogout();
    },
    onError: (error) => {
      // Kể cả khi API lỗi (ví dụ token hết hạn), vẫn phải logout client để user không bị kẹt
      console.error("Logout API failed", error);
      handleClientLogout();
    },
  });
};
