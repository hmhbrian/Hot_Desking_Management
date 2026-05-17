package com.hoang.hot_desking.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CheckInRequest {
    @NotNull(message = "Không tìm thấy mã ghế từ QR")
    private UUID seatId;
    @NotBlank(message = "Thiếu token xác thực đặt chỗ")
    private String qrToken;
}
