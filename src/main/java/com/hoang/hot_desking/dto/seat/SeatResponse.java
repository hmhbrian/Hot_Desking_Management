package com.hoang.hot_desking.dto.seat;

import com.hoang.hot_desking.entity.enums.SeatStatus;
import lombok.*;

import java.util.*;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class SeatResponse {
    private UUID id;
    private String seatNumber;
    private Map<String, Object> features;
    private SeatStatus status;
    private boolean isActive;
    private Long zoneId;
    private String zoneName;
    private String locationName;
}
