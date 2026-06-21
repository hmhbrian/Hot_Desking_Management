"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CalendarRange, Search, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Navigation Config ──────────────────────────────────────────────────────

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

// 2 tab bên trái logo
const LEFT_ITEMS: BottomNavItem[] = [
  { label: "Bookings", href: "/my-bookings", icon: CalendarRange },
  { label: "Đặt chỗ", href: "/book-seat", icon: Search },
];

// 2 tab bên phải logo
const RIGHT_ITEMS: BottomNavItem[] = [
  { label: "Hướng dẫn", href: "/guide", icon: BookOpen },
  { label: "Hồ sơ", href: "/profile", icon: User },
];

// ─── Tab thông thường ────────────────────────────────────────────────────────

function NavTab({ item, isActive }: { item: BottomNavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      id={`bottom-nav-${item.href.replace("/", "")}`}
      className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 focus:outline-none"
    >
      <motion.div
        whileTap={{ scale: 0.82 }}
        className="relative flex flex-col items-center gap-1"
      >
        {/* Active background pill */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="employee-bottom-nav-pill"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute -inset-x-3 -inset-y-1.5 rounded-xl bg-indigo-500/10"
            />
          )}
        </AnimatePresence>

        <Icon
          className={cn(
            "relative h-5 w-5 transition-all duration-200",
            isActive ? "text-indigo-400 scale-110" : "text-slate-500"
          )}
        />
        <span
          className={cn(
            "relative text-[10px] font-medium tracking-wide transition-colors duration-200",
            isActive ? "text-indigo-400" : "text-slate-500"
          )}
        >
          {item.label}
        </span>
      </motion.div>
    </Link>
  );
}

// ─── Logo Center Button ──────────────────────────────────────────────────────

function LogoCenter() {
  return (
    <Link
      href="/my-bookings"
      id="bottom-nav-logo"
      aria-label="HotDeskPro — Trang chủ"
      className="flex flex-col items-center justify-center flex-shrink-0 px-3 h-full gap-1 focus:outline-none"
    >
      <motion.div
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center",
          "bg-gradient-to-br from-indigo-500 to-violet-600",
          "shadow-md shadow-indigo-500/30"
        )}
      >
        <Building2 className="h-4.5 w-4.5 text-white" style={{ height: "18px", width: "18px" }} />
      </motion.div>
      <span className="text-[9px] font-bold tracking-wider text-indigo-400 uppercase">
        HotDesk
      </span>
    </Link>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function EmployeeBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <nav
      id="employee-bottom-nav"
      aria-label="Điều hướng chính"
      className={cn(
        // Chỉ hiển thị trên mobile, ẩn trên lg+
        "flex lg:hidden",
        "fixed bottom-0 left-0 right-0 z-50",
        "h-[64px]",
        "border-t border-white/[0.08]",
        "bg-slate-950/95 backdrop-blur-xl"
      )}
    >
      {/* Safe area padding cho iPhone notch */}
      <div className="w-full flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        
        {/* Tab trái */}
        {LEFT_ITEMS.map((item) => (
          <NavTab key={item.href} item={item} isActive={isActive(item.href)} />
        ))}

        {/* Logo giữa */}
        <LogoCenter />

        {/* Tab phải */}
        {RIGHT_ITEMS.map((item) => (
          <NavTab key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </div>
    </nav>
  );
}
