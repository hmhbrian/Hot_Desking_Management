package com.hoang.hot_desking.integration;

import com.hoang.hot_desking.dto.booking.BookingRequest;
import com.hoang.hot_desking.entity.Seat;
import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.entity.enums.SeatStatus;
import com.hoang.hot_desking.repository.BookingRepository;
import com.hoang.hot_desking.repository.SeatRepository;
import com.hoang.hot_desking.repository.UserRepository;
import com.hoang.hot_desking.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.LocalDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class BookingIntegrationTest {
    @Autowired
    private BookingService bookingService;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private Seat sharedSeat;
    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        // 1. Dọn dẹp sạch sẽ để tránh nhiễu dữ liệu
        redisTemplate.getConnectionFactory().getConnection().flushAll();

        bookingRepository.deleteAll();
        seatRepository.deleteAll();
        userRepository.deleteAll();

        // 2. Tạo User thật xuống DB
        userA = userRepository.save(User.builder().fullName("userA").email("a@gmail.com").build());
        userB = userRepository.save(User.builder().fullName("userB").email("b@gmail.com").build());

        // 3. Tạo Ghế thật với Version = 0
        sharedSeat = Seat.builder()
                .seatNumber("A-101")
                .status(SeatStatus.AVAILABLE)
                .build();
        sharedSeat = seatRepository.save(sharedSeat);
    }

    @Test
    void testRaceCondition_TwoUsersBookSameTime() throws InterruptedException {
        int numberOfThreads = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(1); // cờ hiệu xuất phát

        // Theo dõi số lượng thành công và thất bại
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        // Khung giờ đặt chỗ giống hệt nhau
        BookingRequest request = BookingRequest.builder()
                .seatId(sharedSeat.getId())
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .build();

        // Luồng của User A
        executorService.execute(() -> {
            try {
                latch.await(); // Đợi xuất phát
                bookingService.confirmBooking(request, userA);
                successCount.incrementAndGet();
            } catch (Exception e) {
                failureCount.incrementAndGet();
                System.out.println("User A failed: " + e.getMessage());
            }
        });

        // Luồng của User B
        executorService.execute(() -> {
            try {
                latch.await(); // Đợi súng nổ
                bookingService.confirmBooking(request, userB);
                successCount.incrementAndGet();
            } catch (Exception e) {
                failureCount.incrementAndGet();
                System.out.println("User B failed: " + e.getMessage());
            }
        });

        latch.countDown(); // Cả 2 cùng xuất phát
        executorService.shutdown();
        executorService.awaitTermination(10, TimeUnit.SECONDS);

        // KIỂM TRA KẾT QUẢ
        // chỉ có 1 người được phép SUCCESS
        assertEquals(1, successCount.get(), "Phải có đúng 1 người đặt chỗ thành công");
        assertEquals(1, failureCount.get(), "Phải có 1 người thất bại do tranh chấp hoặc trùng lịch");

        // Kiểm tra version của ghế trong DB phải là 1 (tăng từ 0 lên 1)
        Seat finalSeat = seatRepository.findById(sharedSeat.getId()).get();
        assertEquals(1, finalSeat.getVersion(), "Version của ghế phải được tăng lên 1");
    }
}
