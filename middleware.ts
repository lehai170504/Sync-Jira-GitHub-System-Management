import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Lấy token và role từ cookie
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const { pathname } = request.nextUrl;

  // Hàm kiểm tra định dạng JWT cơ bản (phải có 3 phần tách nhau bởi dấu chấm)
  const isValidToken = (t: string) => {
    return t && t.split(".").length === 3;
  };

  // Danh sách các trang
  const authPaths = ["/login", "/register", "/forgot-password"];
  const protectedPaths = [
    "/dashboard",
    "/lecturer",
    "/admin",
    "/student",
    "/profile",
    "/my-score",
  ];

  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));
  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // --- TRƯỜNG HỢP 1: TRUY CẬP TRANG BẢO VỆ (DASHBOARD...) ---
  if (isProtectedPage) {
    // Nếu không có token HOẶC token sai định dạng (Fake cookie)
    if (!token || !isValidToken(token)) {
      // Tạo response redirect về login
      const response = NextResponse.redirect(new URL("/login", request.url));

      // XÓA SẠCH COOKIE RÁC (Quan trọng để tránh lỗi lặp)
      response.cookies.delete("token");
      response.cookies.delete("refreshToken");
      response.cookies.delete("user_role");
      response.cookies.delete("user_name");
      response.cookies.delete("user_email");

      return response;
    }
    // Nếu token hợp lệ về mặt cấu trúc -> Cho qua (Backend sẽ check signature sau)
  }

  // --- TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP NHƯNG CỐ VÀO LOGIN/REGISTER ---
  if (isAuthPage) {
    if (token && isValidToken(token)) {
      // Điều hướng thông minh dựa trên Role

      // Giảng viên có Dashboard riêng
      if (role === "LECTURER") {
        return NextResponse.redirect(new URL("/lecturer/courses", request.url));
      }

      // Admin và Sinh viên dùng chung Dashboard (Giao diện thay đổi bên trong)
      // Lưu ý: Nếu bạn tách /admin/dashboard riêng thì sửa lại dòng này
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Cho phép tiếp tục nếu không vi phạm các luật trên
  return NextResponse.next();
}

// Cấu hình các route mà Middleware sẽ chạy qua
export const config = {
  matcher: [
    /*
     * Match tất cả request paths ngoại trừ:
     * 1. /api (API routes)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. favicon.ico (favicon file)
     * 5. public images (như logo...)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
