package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.dto.PageResponse;
import com.hoang.hot_desking.dto.seat.*;
import com.hoang.hot_desking.entity.Seat;
import com.hoang.hot_desking.service.SeatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
@Tag(name = "Seats", description = "Quản lý chỗ ngồi")
public class SeatController {
    private final SeatService seatService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<SeatResponse> create(@RequestBody @Valid SeatRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .status(1000)
                .result(seatService.createSeat(request))
                .build();
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<String> createBulk(@RequestBody @Valid SeatBulkRequest request) {
        seatService.createBulkSeats(request);
        return ApiResponse.<String>builder()
                .status(1000)
                .message("Tạo hàng loạt chỗ ngồi thành công")
                .build();
    }

    @GetMapping("/zone/{zoneId}")
    public ApiResponse<List<SeatResponse>> getByZone(@PathVariable Long zoneId) {
        return ApiResponse.<List<SeatResponse>>builder()
                .status(1000)
                .result(seatService.getAllByZone(zoneId))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<SeatResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid SeatRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .status(1000)
                .result(seatService.updateSeat(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        seatService.deleteSeat(id);
        return ApiResponse.<Void>builder()
                .status(1000)
                .message("Xóa chỗ ngồi thành công")
                .build();
    }

    //Hiển thị toàn bộ seat có điều kiện lọc cho Admin
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<SeatResponse>> getAllSeats(@ModelAttribute SeatFilterRequest request) {
        Page<SeatResponse> seatPage = seatService.getAllSeatsForAdmin(request);

        // Map sang PageResponse
        PageResponse<SeatResponse> result = PageResponse.<SeatResponse>builder()
                .data(seatPage.getContent())
                .currentPage(seatPage.getNumber())
                .totalPages(seatPage.getTotalPages())
                .totalElements(seatPage.getTotalElements())
                .pageSize(seatPage.getSize())
                .build();

        return ApiResponse.<PageResponse<SeatResponse>>builder()
                .result(result)
                .build();
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> search(
            @RequestBody @Valid SearchSeatRequest request) {

        return ResponseEntity.ok(ApiResponse.<List<SeatResponse>>builder()
                .result(seatService.searchSeats(request))
                .build());
    }
}
