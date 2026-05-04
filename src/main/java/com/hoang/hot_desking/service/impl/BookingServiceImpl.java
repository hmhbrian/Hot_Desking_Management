package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.component.SeatLockManager;
import com.hoang.hot_desking.dto.booking.BookingDetailResponse;
import com.hoang.hot_desking.dto.booking.BookingRequest;
import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.dto.booking.CheckInRequest;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        // Sử dụng phương thức findByIdWithLock
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

    @Override
    public Page<BookingResponse> getMyBookings(User currentUser, Pageable pageable) {
        return bookingRepository.findByUserIdOrderByStartTimeDesc(currentUser.getId(), pageable)
                .map(bookingMapper::toBookingResponse);
    }

    @Override
    @Transactional
    public void cancelBooking(UUID bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        // 1. Kiểm tra quyền sở hữu
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 2. Kiểm tra thời gian: Không được hủy nếu đã quá giờ bắt đầu
        if (LocalDateTime.now().isAfter(booking.getStartTime())) {
            throw new AppException(ErrorCode.CANCEL_NOT_ALLOWED);
        }

        // 3. Cập nhật trạng thái
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        log.info("User {} đã hủy thành công booking {}", currentUser.getId(), bookingId);
    }

    @Override
    public BookingDetailResponse getBookingDetail(UUID bookingId, User currentUser) {
        // Vừa check tồn tại, vừa check chủ sở hữu
        // JOIN FETCH để lấy luôn Seat và Zone trong 1 câu Query
        return bookingRepository.findByIdAndUserIdWithDetails(bookingId, currentUser.getId())
                .map(bookingMapper::toDetailResponse)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
    }

    @Override
    @Transactional
    public void checkIn(CheckInRequest request, User currentUser) {
        LocalDateTime now = LocalDateTime.now();

        //Tìm booking bằng qrToken
        Booking booking = bookingRepository.findByQrToken(request.getQrToken())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_QR_TOKEN));

        //1: Kiểm tra quyền sở hữu
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        //2: Kiểm tra vị trí (Ghế quét được có đúng ghế đã đặt?)
        if (!booking.getSeat().getId().equals(request.getSeatId())) {
            throw new AppException(ErrorCode.WRONG_SEAT);
        }

        //3: Kiểm tra trạng thái (Chỉ cho phép khi đang là CONFIRMED)
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
        }

        //4: Kiểm tra thời gian
        // Cho phép check-in trước 15p và sau tối đa 30p so với giờ bắt đầu
        if (now.isBefore(booking.getStartTime().minusMinutes(15))) {
            throw new AppException(ErrorCode.CHECKIN_TOO_EARLY);
        }
        if (now.isAfter(booking.getStartTime().plusMinutes(30))) {
            throw new AppException(ErrorCode.CHECKIN_TIMEOUT);
        }

        //Ghi nhận thành công
        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setCheckInAt(now);
        bookingRepository.save(booking);

        log.info("User {} đã check-in thành công tại ghế {}", currentUser.getFullName(), booking.getSeat().getSeatNumber());
    }
}
