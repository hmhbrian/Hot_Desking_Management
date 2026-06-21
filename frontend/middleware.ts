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
  const isEmployeeRoute =
    pathname.startsWith("/my-bookings") ||
    pathname.startsWith("/book-seat") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/guide");

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";
  const isRootRoute = pathname === "/";

  // 3. LOGIC REDIRECT GỐC: "/" → "/my-bookings" hoặc "/login"
  if (isRootRoute) {
    if (token) {
      // Đã đăng nhập → vào trang chủ của Employee
      return NextResponse.redirect(new URL("/my-bookings", request.url));
    } else {
      // Chưa đăng nhập → vào trang login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 4. Nếu đã đăng nhập mà còn vào /login → đá về /my-bookings
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/my-bookings", request.url));
  }

  // 5. Bảo vệ các route yêu cầu đăng nhập
  if ((isEmployeeRoute || isDashboardRoute || isAdminRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Bảo vệ Admin route: chỉ ADMIN mới được vào
  if (isAdminRoute && token) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/my-bookings", request.url));
    }
  }

  // 7. Legacy /dashboard route: Redirect về route mới nếu đã đăng nhập
  if (isDashboardRoute && token) {
    // ADMIN và MANAGER có toàn quyền → cho qua (legacy support)
    if (userRole === "ADMIN" || userRole === "MANAGER") {
      return NextResponse.next();
    }

    // EMPLOYEE: chuyển sang route mới
    if (userRole === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/my-bookings", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Cấu hình các route mà middleware sẽ chạy qua.
 */
export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
    "/my-bookings/:path*",
    "/book-seat/:path*",
    "/profile/:path*",
    "/guide/:path*",
  ],
};
