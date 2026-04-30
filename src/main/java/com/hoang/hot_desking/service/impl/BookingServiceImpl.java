package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.component.SeatLockManager;
import com.hoang.hot_desking.dto.booking.BookingRequest;
import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.entity.Booking;
import com.hoang.hot_desking.entity.Seat;
import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.entity.enums.BookingStatus;
import com.hoang.hot_desking.entity.enums.SeatStatus;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.BookingMapper;
import com.hoang.hot_desking.repository.BookingRepository;
import com.hoang.hot_desking.repository.SeatRepository;
import com.hoang.hot_desking.service.BookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {
    private final SeatRepository seatRepository;
    private final SeatLockManager lockManager;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper; //Inject mapper
    /**
     * Nhân viên nhấn vào ghế để bắt đầu điền thông tin.
     * API này sẽ được gọi trước khi API đặt chỗ chính thức
     */
    @Override
    public void holdSeat(UUID seatId, UUID userId) {
        //kiểm tra ghế có tồn tại và có bị bảo trì không
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));

        if(seat.getStatus() == SeatStatus.MAINTENANCE){
            throw new AppException(ErrorCode.SEAT_MAINTENANCE);
        }
        //Thực hiện khóa trên redis
        //key: seat_lock:{seatId}, value: userId
        boolean held = lockManager.acquireLock(seatId, userId, 5);
        if (!held){
            throw  new AppException(ErrorCode.BOOKING_LOCKED);
        }
    }

    @Override
    @Transactional
    public BookingResponse confirmBooking(BookingRequest request, User currentUser) {
        UUID seatId = request.getSeatId();
        UUID userId = currentUser.getId();

        // 1. Kiểm tra quyền giữ chỗ trên Redis (Check Temporary Lock)
        // Nếu ghế bị khóa bởi người khác hoặc hết hạn 5 phút, sẽ ném lỗi 4003
        if (lockManager.isLockedByOther(seatId, userId)) {
            throw new AppException(ErrorCode.BOOKING_LOCKED);
        }

        // 2. Kiểm tra quy tắc 7 ngày (Business Rule: Chỉ được đặt trước trong vòng 7 ngày)
        if (request.getStartTime().isAfter(LocalDateTime.now().plusDays(7))) {
            throw new AppException(ErrorCode.BOOKING_TOO_FAR); // Mã lỗi 4005
        }

        // 3. Kiểm tra trùng lịch (Overlap) trong Database
        if (bookingRepository.existsOverlapping(seatId, request.getStartTime(), request.getEndTime())) {
            throw new AppException(ErrorCode.BOOKING_OVERLAP); // Ghế đã có người đặt trong khung giờ này
        }

        // 4. Kiểm tra Hạn mức (Quota): 1 người/1 chỗ/1 khung giờ
        if (bookingRepository.existsByUserAndOverlap(userId, request.getStartTime(), request.getEndTime())) {
            throw new AppException(ErrorCode.QUOTA_EXCEEDED);
        }

        // 5. Kích hoạt Optimistic Locking bằng cách truy vấn Seat và tăng version
        // Sử dụng phương thức findByIdWithLock đã tạo ở S2.3
        Seat seat = seatRepository.findByIdWithLock(seatId)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));

        // 6. Lưu bản ghi Booking chính thức [cite: 17]
        Booking booking = Booking.builder()
                .user(currentUser)
                .seat(seat)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(BookingStatus.CONFIRMED)
                .qrToken(UUID.randomUUID().toString()) // Tạo mã QR để check-in sau này
                .build();

        bookingRepository.save(booking);

        // Đăng ký log chỉ in ra sau khi COMMIT thành công
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            //Giải phóng khóa Redis sau khi đặt thành công
                            lockManager.releaseLock(seatId);

                            log.info("Đặt chỗ thành công: User {} đã đặt ghế {} từ {} đến {}",
                                    userId, seatId, request.getStartTime(), request.getEndTime());

                        }
                    }
            );
        }


        return bookingMapper.toBookingResponse(booking);
    }
}
