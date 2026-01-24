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
        console.log("Detect logout from another tab. Clearing cookies...");

        // 1. Xóa toàn bộ Token
        Cookies.remove("token");
        Cookies.remove("refreshToken"); // <--- Thêm mới

        // 2. Xóa thông tin User
        Cookies.remove("user_role");
        Cookies.remove("user_email");
        Cookies.remove("user_name");

        // 3. Chuyển hướng về login
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
