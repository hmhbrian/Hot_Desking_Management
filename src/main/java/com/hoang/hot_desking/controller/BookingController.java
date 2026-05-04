package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.dto.PageResponse;
import com.hoang.hot_desking.dto.booking.BookingDetailResponse;
import com.hoang.hot_desking.dto.booking.BookingRequest;
import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<ApiResponse<String>> holdSeat(
            @PathVariable UUID seatId,
            @AuthenticationPrincipal User currentUser) { // Lấy user hiện tại từ Security Context

        bookingService.holdSeat(seatId, currentUser.getId());

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .result("Ghế đã được giữ thành công. Bạn có 5 phút để hoàn tất thông tin.")
                .build());
    }

    //Xác nhận đặt chỗ
    @PostMapping("/confirm")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBooking(
            @RequestBody @Valid BookingRequest request,
            @AuthenticationPrincipal User currentUser) {

        BookingResponse response = bookingService.confirmBooking(request, currentUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BookingResponse>builder()
                        .result(response)
                        .build());
    }

    //Lấy lịch sử booking
    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<PageResponse<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal User currentUser,
            @ParameterObject Pageable pageable) {

        Page<BookingResponse> bookingPage = bookingService.getMyBookings(currentUser, pageable);

        // Map sang PageResponse
        PageResponse<BookingResponse> result = PageResponse.<BookingResponse>builder()
                .data(bookingPage.getContent())
                .currentPage(bookingPage.getNumber())
                .totalPages(bookingPage.getTotalPages())
                .totalElements(bookingPage.getTotalElements())
                .pageSize(bookingPage.getSize())
                .build();

        return ApiResponse.<PageResponse<BookingResponse>>builder()
                .result(result)
                .build();
    }

    //Hủy booking
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<Void> cancel(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        bookingService.cancelBooking(id, currentUser);
        return ApiResponse.<Void>builder()
                .message("Hủy đặt chỗ thành công")
                .build();
    }

    @GetMapping("/my/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<BookingDetailResponse> getBookingDetail(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {

        return ApiResponse.<BookingDetailResponse>builder()
                .result(bookingService.getBookingDetail(id, currentUser))
                .build();
    }
}
