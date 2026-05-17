package com.hoang.hot_desking.dto.booking;

import com.hoang.hot_desking.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private UUID id;
    private String seatNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
}
