import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware để kiểm soát quyền truy cập dựa trên JWT Token và Role.
 * Chạy trên Edge Runtime, không thể truy cập localStorage.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Lấy Token và Role từ Cookies
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  // 2. Định nghĩa các nhóm route
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";

  // 3. LOGIC BẢO VỆ:

  // --- Trường hợp chưa đăng nhập ---
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Lưu lại URL đang định vào để sau khi login có thể quay lại (tùy chọn)
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu đã đăng nhập mà còn vào /login -> đá về /dashboard
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // --- Trường hợp phân quyền theo Role (RBAC) ---
  if (isDashboardRoute && token) {
    // ADMIN và MANAGER có toàn quyền -> cho qua hết
    if (userRole === "ADMIN" || userRole === "MANAGER") {
      return NextResponse.next();
    }

    // EMPLOYEE: Chỉ được vào trang đặt chỗ (/dashboard/booking)
    if (userRole === "EMPLOYEE") {
      // Danh sách các route mà EMPLOYEE KHÔNG ĐƯỢC VÀO
      const adminOnlyRoutes = [
        "/dashboard/users",
        "/dashboard/seats",
        "/dashboard/settings",
        "/dashboard/reports",
        "/dashboard/locations",
        "/dashboard/zones"
      ];

      const isAccessingAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

      if (isAccessingAdminRoute) {
        // Nếu cố tình vào trang quản trị -> đá về trang booking của họ
        return NextResponse.redirect(new URL("/dashboard/booking", request.url));
      }
    }
  }

  return NextResponse.next();
}

/**
 * Cấu hình các route mà middleware sẽ chạy qua.
 * Chỉ chạy cho các trang dashboard và login để tối ưu hiệu năng.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
  ],
};
