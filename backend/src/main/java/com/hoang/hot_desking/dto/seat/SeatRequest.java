package com.hoang.hot_desking.dto.seat;

import com.hoang.hot_desking.entity.enums.SeatStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class SeatRequest {
    @NotBlank(message = "SEAT_NUMBER_REQUIRED")
    private String seatNumber;
    private Map<String, Object> features;
    private SeatStatus status;
    @NotNull(message = "ZONE_ID_REQUIRED")
    private Long zoneId;
}
