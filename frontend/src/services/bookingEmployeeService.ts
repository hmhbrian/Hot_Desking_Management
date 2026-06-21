import apiClient from "./api";
import { ApiResponse, Booking, BookingRequest, SearchSeatRequest, Seat, PaginatedResponse } from "@/types";

export interface BookingResponse extends Booking {}
export interface SeatResponse extends Seat {}

export const bookingEmployeeService = {
  // Tìm kiếm ghế trống
  searchSeats: async (params: SearchSeatRequest): Promise<SeatResponse[]> => {
    const response = await apiClient.post<ApiResponse<SeatResponse[]>>("/seats/search", params);
    return response.data.result;
  },

  // Giữ chỗ tạm thời
  holdSeat: async (seatId: string): Promise<string> => {
    const response = await apiClient.post<ApiResponse<string>>(`/bookings/hold/${seatId}`);
    return response.data.result;
  },

  // Hủy giữ chỗ
  releaseHold: async (seatId: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponse<string>>(`/bookings/hold/${seatId}`);
    return response.data.message || "";
  },

  // Xác nhận đặt chỗ
  confirmBooking: async (data: BookingRequest): Promise<BookingResponse> => {
    const response = await apiClient.post<ApiResponse<BookingResponse>>("/bookings/confirm", data);
    return response.data.result;
  },

  // Lấy danh sách đặt chỗ của tôi
  getMyBookings: async (params?: any): Promise<PaginatedResponse<BookingResponse>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<BookingResponse>>>("/bookings/me", { params });
    return response.data.result;
  },
};
