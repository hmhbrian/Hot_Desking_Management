"use client";

import { useAuthStore } from "@/store/authStore";
import { 
  Building2, 
  CalendarCheck, 
  ChevronRight, 
  LayoutDashboard, 
  LogOut, 
  MapPin, 
  Monitor, 
  PieChart, 
  Settings, 
  Users 
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Types & Config ---

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  roles?: string[]; // Trống nghĩa là tất cả các role
}

const sidebarItems: SidebarItem[] = [
  { 
    title: "Đặt chỗ", 
    href: "/dashboard/booking", 
    icon: CalendarCheck 
  },
  { 
    title: "Quản lý Chỗ ngồi", 
    href: "/dashboard/seats", 
    icon: Monitor, 
    roles: ["ADMIN", "MANAGER"] 
  },
  { 
    title: "Quản lý Địa điểm", 
    href: "/dashboard/locations", 
    icon: MapPin, 
    roles: ["ADMIN", "MANAGER"] 
  },
  { 
    title: "Quản lý Người dùng", 
    href: "/dashboard/users", 
    icon: Users, 
    roles: ["ADMIN", "MANAGER"] 
  },
  { 
    title: "Báo cáo", 
    href: "/dashboard/reports", 
    icon: PieChart, 
    roles: ["ADMIN", "MANAGER"] 
  },
  { 
    title: "Cài đặt hệ thống", 
    href: "/dashboard/settings", 
    icon: Settings, 
    roles: ["ADMIN", "MANAGER"] 
  },
];

// --- Components ---

function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname();

  // Lọc menu theo role
  const filteredItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(role)
  );

  return (
    <nav className="space-y-1 px-3">
      {filteredItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden",
              isActive 
                ? "bg-blue-600/10 text-blue-400" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}>
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full"
                />
              )}

              {/* Hover Glow */}
              <motion.div
                initial={false}
                whileHover={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 pointer-events-none"
              />

              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-blue-400" : "text-slate-500"
              )} />
              
              <span className="text-sm font-medium flex-1">{item.title}</span>

              {isActive && <ChevronRight className="h-4 w-4" />}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Tránh render layout nếu chưa có user (Zustand persist có thể mất 1 chút thời gian hydrate)
  // Thực tế Middleware đã bảo vệ route này, nên ta có thể render Skeleton hoặc null
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* ─── SIDEBAR ───────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 mb-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              HotDesk<span className="text-blue-400">Pro</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Menu chính
          </div>
          <SidebarNav role={user.role} />
        </div>

        {/* User Quick Info */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-slate-800/50 rounded-2xl p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 overflow-hidden">
              {user.pictureUrl ? (
                <img src={user.pictureUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-blue-400">{user.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl z-40 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-slate-400">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Search/Notifications Placeholder */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
              <kbd className="font-sans">⌘</kbd>
              <span>Tìm kiếm...</span>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 gap-2 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs">Đăng xuất</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
