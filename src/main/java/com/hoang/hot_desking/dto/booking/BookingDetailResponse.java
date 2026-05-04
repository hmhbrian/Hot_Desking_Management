package com.hoang.hot_desking.dto.booking;

import com.hoang.hot_desking.entity.enums.BookingStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailResponse {
    private UUID id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private String qrToken; // Dùng để generate mã QR tại máy check-in

    // Thông tin chi tiết về Ghế
    private SeatInfo seat;

    // Thông tin chi tiết về Khu vực
    private ZoneInfo zone;

    @Data
    @Builder
    public static class SeatInfo {
        private UUID id;
        private String seatNumber;
        private Map<String, Object> features; // Trả về {"monitor": 2, "type": "standing"}
    }

    @Data
    @Builder
    public static class ZoneInfo {
        private Long id;
        private String name;
        private String description;
    }
}
