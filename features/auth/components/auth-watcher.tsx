"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function AuthWatcher() {
  const router = useRouter();

  useEffect(() => {
    // Hàm xử lý khi có sự thay đổi trong localStorage (từ tab khác)
    const syncLogout = (event: StorageEvent) => {
      // Kiểm tra xem key thay đổi có phải là "logout_event" không
      if (event.key === "logout_event") {
        const opt = { path: "/" as const };
        Cookies.remove("token", opt);
        Cookies.remove("refreshToken", opt);
        Cookies.remove("user_role", opt);
        Cookies.remove("user_email", opt);
        Cookies.remove("user_name", opt);
        router.push("/login");
        router.refresh();
      }
    };

    // Đăng ký sự kiện lắng nghe
    window.addEventListener("storage", syncLogout);

    // Dọn dẹp khi unmount
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [router]);

  return null; // Component này chạy ngầm, không render UI
}
