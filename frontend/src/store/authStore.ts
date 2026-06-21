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
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      setAuth: (user, token) => {
        // Lưu vào localStorage cho app state
        localStorage.setItem("token", token);
        
        // Lưu vào Cookies cho Middleware (Next.js Edge Runtime)
        Cookies.set("token", token, { expires: 7, path: "/" }); // Hết hạn sau 7 ngày
        Cookies.set("user_role", user.role, { expires: 7, path: "/" });

        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem("token");
        Cookies.remove("token", { path: "/" });
        Cookies.remove("user_role", { path: "/" });
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // Tên của item trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ lưu các field cần thiết, loại bỏ _hasHydrated (đây là trạng thái runtime)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Callback được gọi sau khi Zustand đọc xong từ localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
