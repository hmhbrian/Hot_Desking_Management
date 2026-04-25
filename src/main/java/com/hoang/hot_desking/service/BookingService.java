package com.hoang.hot_desking.service;

import java.util.UUID;

public interface BookingService {
    void holdSeat(UUID seatId, UUID userId);
}
