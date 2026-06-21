"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, CalendarRange, Search, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeUserAvatar } from "./EmployeeUserAvatar";

// ─── Navigation Config ──────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Đặt chỗ của tôi", href: "/my-bookings", icon: CalendarRange },
  { label: "Đặt chỗ mới", href: "/book-seat", icon: Search },
  { label: "Hướng dẫn", href: "/guide", icon: BookOpen },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function EmployeeTopNav() {
  const pathname = usePathname();

  return (
    <header
      id="employee-top-nav"
      className={cn(
        // Chỉ hiển thị trên lg+, ẩn trên mobile
        "hidden lg:flex",
        "fixed top-0 left-0 right-0 z-50 h-16",
        "border-b border-white/[0.06]",
        "bg-slate-950/80 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 flex items-center justify-between gap-8">
        
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href="/my-bookings"
          id="top-nav-logo"
          className="flex items-center gap-2.5 flex-shrink-0 group"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm">
            HotDesk<span className="text-indigo-400">Pro</span>
          </span>
        </Link>

        {/* ── Nav Links ────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href} id={`top-nav-${item.href.replace("/", "")}`}>
                <div
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl",
                    "text-sm font-medium transition-all duration-200",
                    "hover:bg-white/5",
                    isActive
                      ? "text-indigo-400"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive ? "text-indigo-400" : "text-slate-500"
                    )}
                  />
                  <span>{item.label}</span>

                  {/* Active underline indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="employee-top-nav-active"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ── Right: User Avatar ───────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Subtle divider */}
          <div className="h-6 w-px bg-white/10" />
          <EmployeeUserAvatar size="sm" showName={true} />
        </div>
      </div>
    </header>
  );
}
