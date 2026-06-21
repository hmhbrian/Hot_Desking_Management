package com.hoang.hot_desking.dto.seat;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SearchSeatRequest {
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startTime;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime endTime;

    private Long locationId;  // Lọc theo văn phòng
    private Long zoneId;      // Lọc theo khu vực

    // Các tiêu chí lọc features
    private Integer minMonitors;
    private String seatType;
}
