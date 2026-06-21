"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Role badge colors
const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: "Admin",
    className: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  MANAGER: {
    label: "Manager",
    className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  EMPLOYEE: {
    label: "Employee",
    className: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
};

interface EmployeeUserAvatarProps {
  /** "sm" dùng trong TopNav desktop, "md" dùng độc lập */
  size?: "sm" | "md";
  showName?: boolean;
}

export function EmployeeUserAvatar({
  size = "sm",
  showName = false,
}: EmployeeUserAvatarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.EMPLOYEE;
  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const avatarSizeClass = size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";

  return (
    <div ref={ref} className="relative">
      <button
        id="employee-user-avatar-btn"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 rounded-xl p-1 transition-all duration-200",
          "hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        )}
        aria-label="Tài khoản của bạn"
        aria-expanded={open}
      >
        {/* Avatar */}
        <div
          className={cn(
            "rounded-full flex items-center justify-center overflow-hidden",
            "border-2 border-indigo-500/30 bg-indigo-500/20 flex-shrink-0",
            avatarSizeClass
          )}
        >
          {user.pictureUrl ? (
            <img
              src={user.pictureUrl}
              alt={user.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-bold text-indigo-300">{initials}</span>
          )}
        </div>

        {/* Name (optional) */}
        {showName && (
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight max-w-[120px] truncate">
              {user.fullName}
            </p>
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider leading-tight",
                "text-indigo-400"
              )}
            >
              {roleConfig.label}
            </p>
          </div>
        )}

        {showName && (
          <ChevronDown
            className={cn(
              "hidden sm:block h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full mt-2 z-[100]",
              "w-64 rounded-2xl border border-white/10",
              "bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40"
            )}
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-500/30 bg-indigo-500/20 flex-shrink-0">
                  {user.pictureUrl ? (
                    <img
                      src={user.pictureUrl}
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-indigo-300">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <span
                    className={cn(
                      "inline-block mt-1 text-[10px] font-bold uppercase tracking-wider",
                      "px-2 py-0.5 rounded-full border",
                      roleConfig.className
                    )}
                  >
                    {roleConfig.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                href="/profile"
                id="dropdown-profile-link"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150"
              >
                <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span>Hồ sơ cá nhân</span>
              </Link>

              {/* Admin Panel shortcut nếu là Admin */}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  id="dropdown-admin-link"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150"
                >
                  <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <Shield className="h-3.5 w-3.5 text-rose-400" />
                  </div>
                  <span>Admin Panel</span>
                </Link>
              )}

              <div className="my-1.5 border-t border-white/5" />

              <button
                id="dropdown-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-150"
              >
                <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <LogOut className="h-3.5 w-3.5 text-rose-400" />
                </div>
                <span>Đăng xuất</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
