"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Đặt cookie để Backend biết đường quay về sau khi login thành công
    // path=/ đảm bảo cookie có hiệu lực toàn trang, max-age=300 (5 phút) là đủ cho 1 lần login
    document.cookie = "redirect_uri=http://localhost:3000/auth/callback; path=/; max-age=300";

    // Chuyển hướng người dùng đến URL OAuth2 của Backend Spring Boot
    // Mặc định Spring Security dùng path: /oauth2/authorization/{provider}
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Trình trang trí background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in duration-500">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              HotDesk<span className="text-blue-400">Pro</span>
            </span>
          </Link>
        </div>

        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Chào mừng trở lại</CardTitle>
            <CardDescription className="text-slate-400">
              Sử dụng tài khoản công ty để truy cập hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Button 
              variant="outline" 
              className="h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all duration-200 gap-3"
              onClick={handleGoogleLogin}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Tiếp tục với Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">Hoặc</span>
              </div>
            </div>

            <Link 
              href="mailto:support@hotdeskpro.com" 
              className={buttonVariants({ variant: "link", className: "text-slate-400 hover:text-white transition-colors gap-2" })}
            >
              <Mail className="h-4 w-4" />
              Liên hệ hỗ trợ kỹ thuật
            </Link>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <Link href="#" className="text-slate-400 hover:underline">Điều khoản dịch vụ</Link>
        </p>
      </div>
    </main>
  );
}
