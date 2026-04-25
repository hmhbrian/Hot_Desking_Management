package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bookings")
@Tag(name = "Bookings", description = "Quản lý đặt chỗ")
public class BookingController {
    private final BookingService bookingService;

    /**
     * API Giữ chỗ: Được gọi ngay khi nhân viên click chọn một ghế trên sơ đồ.
     * Mục tiêu: Tạm khóa ghế trên Redis trong 5 phút để nhân viên điền thông tin.
     */
    @PostMapping("/hold/{seatId}")
    public ResponseEntity<ApiResponse<String>> holdSeat(
            @PathVariable UUID seatId,
            @AuthenticationPrincipal User currentUser) { // Lấy user hiện tại từ Security Context

        bookingService.holdSeat(seatId, currentUser.getId());

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .result("Ghế đã được giữ thành công. Bạn có 5 phút để hoàn tất thông tin.")
                .build());
    }
}
