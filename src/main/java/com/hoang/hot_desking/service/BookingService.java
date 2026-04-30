package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.booking.BookingRequest;
import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.entity.User;

import java.util.UUID;

public interface BookingService {
    void holdSeat(UUID seatId, UUID userId);
    BookingResponse confirmBooking(BookingRequest request, User currentUser);
}
