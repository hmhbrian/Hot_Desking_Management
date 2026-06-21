package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.booking.AdminBookingResponse;
import com.hoang.hot_desking.dto.booking.BookingDetailResponse;
import com.hoang.hot_desking.dto.booking.BookingRequest;
import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.dto.booking.CheckInRequest;
import com.hoang.hot_desking.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface BookingService {
    void holdSeat(UUID seatId, UUID userId);
    void releaseHold(UUID seatId, UUID userId);
    BookingResponse confirmBooking(BookingRequest request, User currentUser);
    Page<BookingResponse> getMyBookings(User currentUser, Pageable pageable);
    void cancelBooking(UUID bookingId, User currentUser);
    BookingDetailResponse getBookingDetail(UUID bookingId, User currentUser);
    void checkIn(CheckInRequest request, User currentUser);
    void checkOut(UUID bookingId, User currentUser);
    Page<AdminBookingResponse> getAllBookingsForAdmin(String status, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);
    void forceCancelBooking(UUID bookingId, User adminUser);
}
