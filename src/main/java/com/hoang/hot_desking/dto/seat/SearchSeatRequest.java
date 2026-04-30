package com.hoang.hot_desking.dto.seat;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SearchSeatRequest {
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startTime;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime endTime;

    private UUID zoneId;

    // Các tiêu chí lọc features (ví dụ cụ thể)
    private Integer minMonitors;
    private String seatType;
}
