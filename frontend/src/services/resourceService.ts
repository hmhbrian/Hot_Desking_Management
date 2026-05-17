import apiClient from "./api";
import { ApiResponse, Seat, PaginatedResponse, Location, Zone } from "@/types";

export const seatService = {
  getAll: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Seat>>>("/seats", { params });
    return response.data.result;
  },
  create: async (data: Partial<Seat>) => {
    const response = await apiClient.post<ApiResponse<Seat>>("/seats", data);
    return response.data.result;
  },
  createBulk: async (data: { zoneId: number; prefix: string; quantity: number; features: any }) => {
    const response = await apiClient.post<ApiResponse<string>>("/seats/bulk", data);
    return response.data;
  },
  update: async (id: string, data: Partial<Seat>) => {
    const response = await apiClient.put<ApiResponse<Seat>>(`/seats/${id}`, data);
    return response.data.result;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/seats/${id}`);
    return response.data;
  },
};

export const zoneService = {
  getAll: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<Zone[]>>("/zones", { params });
    return response.data.result;
  },
  create: async (data: Partial<Zone>) => {
    const response = await apiClient.post<ApiResponse<Zone>>("/zones", data);
    return response.data.result;
  },
  update: async (id: number, data: Partial<Zone>) => {
    const response = await apiClient.put<ApiResponse<Zone>>(`/zones/${id}`, data);
    return response.data.result;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<string>>(`/zones/${id}`);
    return response.data;
  },
};

export const locationService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Location[]>>("/locations");
    return response.data.result;
  },
  create: async (data: Partial<Location>) => {
    const response = await apiClient.post<ApiResponse<Location>>("/locations", data);
    return response.data.result;
  },
  update: async (id: number, data: Partial<Location>) => {
    const response = await apiClient.put<ApiResponse<Location>>(`/locations/${id}`, data);
    return response.data.result;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<string>>(`/locations/${id}`);
    return response.data;
  },
};
