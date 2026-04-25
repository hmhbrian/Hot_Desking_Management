package com.hoang.hot_desking.exception;

import com.hoang.hot_desking.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Bắt lỗi tự định nghĩa (AppException)
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .status(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    // Bắt lỗi Validation (@Valid)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) { /* Giữ mặc định */ }

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .status(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.badRequest().body(apiResponse);
    }

    /**
     * Xử lý ngoại lệ xung đột dữ liệu đồng thời (Optimistic Locking).
     * * TRƯỜNG HỢP XẢY RA:
     * Hai nhân viên cùng nhấn nút "Đặt ngay" cho cùng một ghế tại cùng một thời điểm.
     * Hệ thống sẽ dựa vào @Version trong Entity Seat để phát hiện ra sự thay đổi.
     * Người đến sau sẽ có số version cũ hơn version hiện tại trong Database.
     * * @param ex Ngoại lệ do Spring Data JPA ném ra khi vi phạm version
     * @return Đối tượng ApiResponse chứa mã lỗi và thông điệp nghiệp vụ
    */
    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    ResponseEntity<ApiResponse<?>> handleOptimisticLocking(ObjectOptimisticLockingFailureException ex){
        log.error("Race Condition detected: Ghế đã bị thay đổi bởi một giao dịch khác.");

        ErrorCode errorCode = ErrorCode.BOOKING_OVERLAP;

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .status(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
