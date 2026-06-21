"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token");

      if (token) {
        try {
          // 1. Lưu tạm token vào localStorage để getMe() có thể gửi Authorization header
          localStorage.setItem("token", token);

          // 2. Gọi API lấy thông tin user chi tiết
          const user = await authService.getMe();

          // 3. Cập nhật vào Zustand Store (hàm setAuth sẽ tự lưu vào Cookies cho Middleware)
          setAuth(user, token);

          // 4. Chuyển hướng dựa trên role
          if (user.role === "ADMIN") {
            router.push("/admin");
          } else {
            // EMPLOYEE & MANAGER → trang chủ của Employee portal
            router.push("/my-bookings");
          }
        } catch (error) {
          console.error("Lỗi khi xử lý token:", error);
          router.push("/login?error=auth_failed");
        }
      } else {
        router.push("/login");
      }
    };

    handleAuth();
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Đang xác thực...</h2>
          <p className="text-slate-400 text-sm">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
