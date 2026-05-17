"use client";

import { useAuthStore } from "@/store/authStore";
import { 
  Building2, 
  CalendarRange, 
  ChevronRight, 
  Database, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Settings, 
  Users, 
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// --- Types & Config ---

interface AdminSidebarItem {
  title: string;
  href: string;
  icon: any;
}

const adminMenuItems: AdminSidebarItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Resources", href: "/admin/resources", icon: Database },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarRange },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

// --- Components ---

function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(p => p);
  
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span className="text-slate-500 uppercase tracking-wider">Hệ thống</span>
      {paths.map((p, i) => (
        <div key={p} className="flex items-center gap-2 capitalize">
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className={i === paths.length - 1 ? "text-rose-400" : "text-slate-400"}>
            {p}
          </span>
        </div>
      ))}
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 mb-4">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Admin<span className="text-rose-500">Panel</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        <div className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Quản trị hệ thống
        </div>
        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <div className={cn(
                "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden mb-1",
                isActive 
                  ? "bg-rose-500/10 text-rose-400" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="admin-sidebar-active"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-rose-500 rounded-r-full"
                  />
                )}
                
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-rose-400" : "text-slate-500"
                )} />
                <span className="text-sm font-medium flex-1">{item.title}</span>
                {isActive && <div className="h-1 w-1 rounded-full bg-rose-500" />}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Đóng menu khi resize lên desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Chỉ cho phép ADMIN truy cập (Middleware cũng đã chặn, nhưng layer này bảo vệ thêm)
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white p-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Truy cập bị từ chối</h1>
          <p className="text-slate-400">Bạn không có quyền truy cập vào khu vực quản trị.</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4 bg-rose-500 hover:bg-rose-600">
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* ─── DESKTOP SIDEBAR ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl z-50 flex-col">
        <SidebarContent />
        
        {/* User Quick Info */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-slate-800/50 rounded-2xl p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30 overflow-hidden">
              {user.pictureUrl ? (
                <img src={user.pictureUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-rose-400">{user.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tighter">System Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE SIDEBAR OVERLAY ───────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 z-[70] lg:hidden shadow-2xl border-r border-white/10"
            >
              <div className="absolute right-4 top-6">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        {/* Header */}
        <header className="sticky top-0 h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl z-40 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-400"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-8 w-px bg-white/10" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 gap-2 transition-all px-2 sm:px-4"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Thoát</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
