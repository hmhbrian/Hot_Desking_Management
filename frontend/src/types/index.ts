// =============================================
// Core TypeScript Types for Hot Desking System
// =============================================

// --- Enums ---
export type SeatStatus = "AVAILABLE" | "LOCKED" | "MAINTENANCE";

export type BookingStatus = 
  | "CONFIRMED" 
  | "CHECKED_IN" 
  | "COMPLETED" 
  | "CANCELLED" 
  | "EXPIRED" 
  | "NO_SHOW";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

// --- Interfaces ---

export interface User {
  id: string; // UUID
  email: string;
  fullName: string;
  googleId?: string;
  pictureUrl?: string;
  role: UserRole;
  enabled: boolean;
  departmentId?: number;
  departmentName?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  totalZones?: number;
  totalSeats?: number;
}

export interface Zone {
  id: number;
  name: string;
  description?: string;
  locationId?: number;
  locationName?: string;
  totalSeats?: number;
}

export interface Seat {
  id: string; // UUID
  seatNumber: string;
  features?: Record<string, any>; // Ví dụ: {"monitor": 2, "type": "standing"}
  status: SeatStatus;
  isActive: boolean;
  zoneId?: number;
  zoneName?: string;
  locationName?: string;
}

export interface Booking {
  id: string; // UUID
  seatNumber: string;
  startTime: string; // ISO LocalDateTime
  endTime: string; // ISO LocalDateTime
  status: BookingStatus;
  createdAt?: string;
  qrToken?: string;
  seat?: {
    id: string;
    seatNumber: string;
    features?: Record<string, any>;
  };
  zone?: {
    id: number;
    name: string;
    description?: string;
  };
}

// --- API Response Wrappers ---

/**
 * Wrapper cho tất cả các phản hồi từ API
 */
export interface ApiResponse<T> {
  status: number; // Mã code (VD: 1000)
  message?: string;
  result: T;
}

/**
 * Phản hồi phân trang (PageResponse trong backend)
 */
export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

// --- Request DTOs (Optional but helpful) ---

export interface BookingRequest {
  seatId: string;
  startTime: string; // ISO LocalDateTime
  endTime: string; // ISO LocalDateTime
}

export interface SearchSeatRequest {
  locationId?: number;
  zoneId?: number;
  startTime: string;
  endTime: string;
  seatStatus?: SeatStatus;
}
