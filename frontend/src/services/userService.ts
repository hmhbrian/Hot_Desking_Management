import apiClient from "./api";
import { ApiResponse, User, PaginatedResponse, Department } from "@/types";

export interface UserSearchParams {
  query?: string;
  role?: string;
  departmentId?: number;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export const userService = {
  searchUsers: async (params: UserSearchParams) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>("/users", { params });
    return response.data.result;
  },
  
  getDepartments: async () => {
    const response = await apiClient.get<ApiResponse<Department[]>>("/departments");
    return response.data.result;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.result;
  }
};
