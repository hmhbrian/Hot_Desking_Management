package com.hoang.hot_desking.dto.seat;

import com.hoang.hot_desking.entity.enums.SeatStatus;
import lombok.Data;

@Data
public class SeatFilterRequest {
    private String seatNumber; // Tìm kiếm theo số ghế (LIKE)
    private SeatStatus status; // Lọc theo trạng thái
    private Boolean isActive;  // Lọc ghế đang hoạt động hay đã ẩn
    private Long zoneId;       // Lọc theo khu vực

    // Các tham số phân trang
    private int page = 0;
    private int size = 10;
    private String sortBy = "seatNumber";
    private String sortDir = "asc";
}
