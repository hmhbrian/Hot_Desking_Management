import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor — attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
// QUAN TRỌNG: Phải xóa đồng bộ cả 3 nơi lưu token:
// 1. localStorage (raw key "token" dùng bởi api.ts)
// 2. Cookies (dùng bởi Next.js middleware)
// 3. localStorage key "auth-storage" (dùng bởi Zustand persist)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Xóa raw token key
        localStorage.removeItem("token");
        // Xóa Zustand persist data để store hydrate lại với isAuthenticated=false
        localStorage.removeItem("auth-storage");
        // Xóa cookies mà middleware dùng để bảo vệ route
        Cookies.remove("token", { path: "/" });
        Cookies.remove("user_role", { path: "/" });
        // Redirect về login (full reload để reset toàn bộ state)
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
