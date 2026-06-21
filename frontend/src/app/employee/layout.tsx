"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { EmployeeTopNav } from "@/components/employee/EmployeeTopNav";
import { EmployeeBottomNav } from "@/components/employee/EmployeeBottomNav";

// ─── Guard: Yêu cầu đăng nhập ────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // QUAN TRỌNG: Chỉ kiểm tra sau khi Zustand đã hydrate xong từ localStorage.
    // Nếu kiểm tra trước, isAuthenticated luôn là false (giá trị mặc định)
    // và sẽ redirect về /login ngay cả khi user đã đăng nhập!
    if (_hasHydrated && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // Hiển thị loading spinner trong khi Zustand đang đọc từ localStorage (hydrating)
  // hoặc khi chưa xác thực được (trước khi redirect)
  if (!_hasHydrated || !isAuthenticated || !user) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[200]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          </div>
          <p className="text-sm text-slate-400">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Layout Root ─────────────────────────────────────────────────────────────

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {/* Wrapper toàn trang */}
      <div className="min-h-screen bg-slate-950 text-slate-100 font-be-vietnam-pro">

        {/* ── DESKTOP: Top Navigation Bar ─────────────────────────────── */}
        {/*  hidden by default, flex on lg+ (handled inside component)    */}
        <EmployeeTopNav />

        {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
        {/*
          Padding logic:
          - Mobile:  pt-4   (không có TopNav)  +  pb-24 (nhường BottomNav 68px)
          - Desktop: pt-16  (nhường TopNav)    +  pb-8  (không có BottomNav)
        */}
        <main
          className="
            mx-auto w-full max-w-4xl px-4 
            pt-4 pb-28
            lg:pt-24 lg:pb-10 lg:px-6
          "
        >
          {/* Page transition */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>

        {/* ── MOBILE: Bottom Navigation Bar ───────────────────────────── */}
        {/*  flex by default, hidden on lg+ (handled inside component)    */}
        <EmployeeBottomNav />
      </div>
    </AuthGuard>
  );
}
