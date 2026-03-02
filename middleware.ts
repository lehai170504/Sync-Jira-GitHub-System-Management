import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Lấy token và role từ cookie
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const { pathname } = request.nextUrl;

  // Hàm kiểm tra định dạng JWT cơ bản
  const isValidToken = (t: string) => {
    return t && t.split(".").length === 3;
  };

  // --- CẤU HÌNH CÁC PATH ---
  const authPaths = ["/login", "/register", "/forgot-password"];
  const protectedPaths = [
    "/dashboard",
    "/lecturer",
    "/admin",
    "/student",
    "/profile",
    "/my-score",
  ];

  // 👇 THÊM: Kiểm tra xem có phải trang chủ không
  const isRootPath = pathname === "/";

  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));
  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // --- TRƯỜNG HỢP 1: TRUY CẬP TRANG BẢO VỆ (DASHBOARD...) ---
  // (Logic này giữ nguyên: Chưa đăng nhập -> Đá về Login)
  if (isProtectedPage) {
    if (!token || !isValidToken(token)) {
      const response = NextResponse.redirect(new URL("/login", request.url));

      // Xóa cookie rác
      response.cookies.delete("token");
      response.cookies.delete("refreshToken");
      response.cookies.delete("user_role");
      response.cookies.delete("user_name");
      response.cookies.delete("user_email");

      return response;
    }
  }

  // --- TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP (CÓ TOKEN) ---
  if (isAuthPage || isRootPath) {
    if (token && isValidToken(token)) {
      // Điều hướng thông minh dựa trên Role
      if (role === "LECTURER") {
        return NextResponse.redirect(new URL("/lecturer/courses", request.url));
      }

      // 👇 THÊM ĐIỀU KIỆN CHO STUDENT ĐI VÀO TRANG CHỌN LỚP 👇
      if (role === "STUDENT") {
        return NextResponse.redirect(new URL("/courses", request.url));
      }

      // Nếu có role ADMIN thì đưa về trang admin (tùy dự án của bạn)
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Fallback mặc định nếu không khớp role nào
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
