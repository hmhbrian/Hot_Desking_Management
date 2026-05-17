import apiClient from "./api";
import { ApiResponse, UserRole } from "@/types";

interface LoginResponse {
  token: string;
  user: {
    email: string;
    fullName: string;
    role: UserRole;
    pictureUrl?: string;
  };
}

export const authService = {
  /**
   * Gửi Google Auth Code lên Backend để nhận JWT
   * @param code Code nhận được từ Google Pop-up/Redirect
   */
  loginWithGoogle: async (code: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/google", {
      code,
    });
    return response.data.result;
  },

  /**
   * (Tùy chọn) Lấy thông tin user hiện tại từ token
   */
  getMe: async () => {
    const response = await apiClient.get<ApiResponse<any>>("/users/me");
    return response.data.result;
  }
};
