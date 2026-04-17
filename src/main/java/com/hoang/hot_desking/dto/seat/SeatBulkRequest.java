package com.hoang.hot_desking.dto.seat;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Map;

@Data
public class SeatBulkRequest {
    @NotNull(message = "ZONE_ID_REQUIRED")
    private Long zoneId;

    @NotBlank(message = "PREFIX_REQUIRED")
    private String prefix; // VD: "WS" (Workstation)

    @Min(value = 1, message = "INVALID_SEAT_QUANTITY")
    private int quantity;

    private Map<String, Object> features;
}
