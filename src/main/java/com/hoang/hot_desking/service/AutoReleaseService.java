package com.hoang.hot_desking.service;

import com.hoang.hot_desking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

public interface AutoReleaseService {
    void processAutoRelease();
}
