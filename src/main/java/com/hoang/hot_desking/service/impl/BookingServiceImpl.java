package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.component.SeatLockManager;
import com.hoang.hot_desking.entity.Seat;
import com.hoang.hot_desking.entity.enums.SeatStatus;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.repository.SeatRepository;
import com.hoang.hot_desking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final SeatRepository seatRepository;
    private final SeatLockManager lockManager;
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
}
