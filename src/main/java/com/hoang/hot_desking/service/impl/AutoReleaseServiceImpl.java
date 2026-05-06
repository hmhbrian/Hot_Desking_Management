package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.repository.BookingRepository;
import com.hoang.hot_desking.service.AutoReleaseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class AutoReleaseServiceImpl implements AutoReleaseService {
    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public void processAutoRelease() {
        //Sau 30' không check-in sẽ bị hủy booking
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);

        int count = bookingRepository.releaseNoShowBookings(threshold);

        if(count > 0){
            log.info("Hệ thống đã tự động giải phóng {} chỗ ngồi do quá giờ check-in", count);
        }
    }
}
