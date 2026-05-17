package com.hoang.hot_desking.component;

import com.hoang.hot_desking.service.AutoReleaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingScheduler {
    private final AutoReleaseService autoReleaseService;

    //Chạy mỗi 5 phút (300,000 milliseconds)
    @Scheduled(fixedRate = 300000)
    public void scheduleAutoRelease(){
        autoReleaseService.processAutoRelease();
    }
}
