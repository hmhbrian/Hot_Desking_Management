package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.seat.*;
import org.springframework.data.domain.Page;

import java.util.*;

public interface SeatService {
    SeatResponse createSeat(SeatRequest request);
    void createBulkSeats(SeatBulkRequest request);
    List<SeatResponse> getAllByZone(Long zoneId);
    SeatResponse updateSeat(UUID id, SeatRequest request);
    void deleteSeat(UUID id);
    List<SeatResponse> searchSeats(SearchSeatRequest request);
    Page<SeatResponse> getAllSeatsForAdmin(SeatFilterRequest request);
}
