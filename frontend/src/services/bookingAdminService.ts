import apiClient from "./api";
import { ApiResponse, PaginatedResponse, AdminBookingResponse } from "@/types";

export const bookingAdminService = {
  getAll: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<AdminBookingResponse>>>("/bookings/admin", { params });
    return response.data.result;
  },
  
  forceCancel: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/bookings/admin/${id}/cancel`);
    return response.data;
  },
};
