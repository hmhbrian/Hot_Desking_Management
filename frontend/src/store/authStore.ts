import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserRole } from "@/types";
import Cookies from "js-cookie";

interface AuthUser {
  email: string;
  fullName: string;
  role: UserRole;
  pictureUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        // Lưu vào localStorage cho app state
        localStorage.setItem("token", token);
        
        // Lưu vào Cookies cho Middleware (Next.js Edge Runtime)
        Cookies.set("token", token, { expires: 7 }); // Hết hạn sau 7 ngày
        Cookies.set("user_role", user.role, { expires: 7 });

        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem("token");
        Cookies.remove("token");
        Cookies.remove("user_role");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // Tên của item trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
