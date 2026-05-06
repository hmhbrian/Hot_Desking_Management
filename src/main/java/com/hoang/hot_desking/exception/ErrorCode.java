package com.hoang.hot_desking.exception;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // System & Auth
    UNCATEGORIZED_EXCEPTION(1000, "Lỗi hệ thống chưa xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Mã lỗi (Enum Key) không hợp lệ", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1002, "Người dùng chưa đăng nhập hoặc Token hết hạn", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1003, "Bạn không có quyền thực hiện hành động này", HttpStatus.FORBIDDEN),
    VALIDATION_ERROR(1004, "Dữ liệu đầu vào không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_TIME_RANGE(1005, "Thời gian tìm kiếm không hợp lệ", HttpStatus.BAD_REQUEST),
    // User & Department
    USER_NOT_EXISTED(2001, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    USER_EXISTED(2002, "Người dùng đã tồn tại trên hệ thống", HttpStatus.CONFLICT),
    DEPARTMENT_NOT_FOUND(2003, "Phòng ban không tồn tại", HttpStatus.NOT_FOUND),
    DEPARTMENT_EXISTED(2004, "Tên phòng ban đã tồn tại", HttpStatus.CONFLICT),
    DEPARTMENT_NAME_INVALID(2005,"Tên phòng ban không được để trống",HttpStatus.BAD_REQUEST),
    // Locations, Zones, Seats
    LOCATION_NOT_FOUND(3001, "Văn phòng không tồn tại", HttpStatus.NOT_FOUND),
    LOCATION_EXISTED(3002, "Tên văn phòng đã tồn tại", HttpStatus.CONFLICT),
    LOCATION_NAME_INVALID(3003, "Tên văn phòng không được để trống", HttpStatus.BAD_REQUEST),
    ZONE_NOT_FOUND(3004, "Khu vực không tồn tại", HttpStatus.NOT_FOUND),
    ZONE_EXISTED(3005, "Tên khu vực đã tồn tại trong văn phòng này", HttpStatus.CONFLICT),
    ZONE_NAME_INVALID(3006, "Tên khu vực không được để trống", HttpStatus.BAD_REQUEST),
    ZONE_LOCATION_INVALID(3007, "Văn phòng không được để trống", HttpStatus.BAD_REQUEST),
    SEAT_NOT_FOUND(3008, "Chỗ ngồi không tồn tại", HttpStatus.NOT_FOUND),
    SEAT_ALREADY_LOCKED(3009, "Chỗ ngồi đang được người khác chọn (đang giữ chỗ)", HttpStatus.CONFLICT),
    SEAT_MAINTENANCE(3010, "Chỗ ngồi đang bảo trì, không thể đặt", HttpStatus.BAD_REQUEST),
    INVALID_SEAT_QUANTITY(3011, "Số lượng ghế tạo mới phải lớn hơn 0", HttpStatus.BAD_REQUEST),
    // Booking Business Rules
    BOOKING_NOT_FOUND(4001, "Thông tin đặt chỗ không tồn tại", HttpStatus.NOT_FOUND),
    BOOKING_OVERLAP(4002, "Chỗ ngồi đã bị đặt trong khung giờ này", HttpStatus.CONFLICT),
    BOOKING_LOCKED(4003,"Chỗ ngồi này đang được người khác giữ chỗ tạm thời.", HttpStatus.LOCKED),
    QUOTA_EXCEEDED(4004, "Bạn đã đạt giới hạn số lượng đặt chỗ trong cùng một thời điểm", HttpStatus.BAD_REQUEST),
    BOOKING_TOO_FAR(4005, "Thời gian đặt chỗ không hợp lệ (Chỉ được đặt trước tối đa 7 ngày)", HttpStatus.BAD_REQUEST),
    INVALID_BOOKING_STATUS(4006, "Trạng thái đặt chỗ không phù hợp", HttpStatus.BAD_REQUEST),
    CANCEL_NOT_ALLOWED(4007,"Không được hủy do đã quá giờ bắt đầu",HttpStatus.BAD_REQUEST),
    CHECKIN_TOO_EARLY(4008, "Vẫn còn sớm mà, đợi tí rồi hãy check-in nhé!", HttpStatus.TOO_EARLY),
    CHECKIN_TIMEOUT(4009, "Đã quá thời gian cho phép check-in", HttpStatus.GONE),
    INVALID_QR_TOKEN(4010, "Mã QR không hợp lệ hoặc đã hết hạn", HttpStatus.BAD_REQUEST),
    ALREADY_CHECKED_IN(4011, "Bạn đã thực hiện check-in cho lượt đặt này rồi", HttpStatus.BAD_REQUEST),
    WRONG_SEAT(4012,"Bạn đứng sai bàn rồi, hãy kiểm tra lại số ghế", HttpStatus.BAD_REQUEST);
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
