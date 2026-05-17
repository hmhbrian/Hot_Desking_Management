package com.hoang.hot_desking.service;

import com.hoang.hot_desking.component.SeatLockManager;
import com.hoang.hot_desking.dto.booking.BookingRequest;
import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.entity.Seat;
import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.BookingMapper;
import com.hoang.hot_desking.repository.BookingRepository;
import com.hoang.hot_desking.repository.SeatRepository;
import com.hoang.hot_desking.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceImplTest {
    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private SeatRepository seatRepository;
    @Mock
    private SeatLockManager lockManager;
    @Mock
    private BookingMapper bookingMapper;

    @InjectMocks
    private BookingServiceImpl bookingService; // Inject các mock vào service này

    private User mockUser;
    private Seat mockSeat;
    private BookingRequest mockRequest;

    @BeforeEach
    void setUp() {
        mockUser = User.builder().id(UUID.randomUUID()).build();
        mockSeat = Seat.builder().id(UUID.randomUUID()).seatNumber("A102").build();

        mockRequest = BookingRequest.builder()
                .seatId(mockSeat.getId())
                .startTime(LocalDateTime.now().plusDays(1)) // Ngày mai
                .endTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .build();
    }

    @Test
    void confirmBooking_Success() {
        // GIVEN: Giả lập các điều kiện đều thỏa mãn
        when(lockManager.isLockedByOther(any(), any())).thenReturn(false);
        when(bookingRepository.existsOverlapping(any(), any(), any())).thenReturn(false);
        when(seatRepository.findByIdWithLock(any())).thenReturn(Optional.of(mockSeat));

        // Giả lập mapper trả về response
        BookingResponse expectedResponse = BookingResponse.builder().seatNumber("A102").build();
        when(bookingMapper.toBookingResponse(any())).thenReturn(expectedResponse);

        // WHEN: Thực hiện gọi hàm đặt chỗ
        BookingResponse actualResponse = bookingService.confirmBooking(mockRequest, mockUser);

        // THEN: Kiểm tra kết quả
        assertNotNull(actualResponse);
        assertEquals("A102", actualResponse.getSeatNumber());

        // Kiểm tra xem các hàm quan trọng có được gọi đúng không
        verify(bookingRepository, times(1)).save(any()); // Phải gọi hàm lưu
        verify(lockManager, times(1)).releaseLock(mockSeat.getId()); // Phải giải phóng khóa Redis
    }

    //Race Condition Test
    @Test
    void testConcurrentBooking() throws InterruptedException, ExecutionException {
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch latch = new CountDownLatch(1); // Chốt chặn để cả 2 cùng chạy

        // Giả lập 2 Request từ 2 User khác nhau
        Callable<String> task = () -> {
            latch.await(); // Đợi bắt đầu mới chạy
            try {
                bookingService.confirmBooking(mockRequest, mockUser);
                return "SUCCESS";
            } catch (Exception e) {
                return e.getClass().getSimpleName();
            }
        };

        // Kích hoạt cả 2 cùng lúc
        Future<String> result1 = executor.submit(task);
        Future<String> result2 = executor.submit(task);

        latch.countDown(); //Cả 2 cùng chạy vào confirmBooking

        System.out.println("Result 1: " + result1.get());
        System.out.println("Result 2: " + result2.get());
    }

    @Test
    void confirmBooking_Fail_Overlap() {
        // GIVEN: Khóa Redis ổn nhưng Database báo đã có người đặt rồi
        when(lockManager.isLockedByOther(any(), any())).thenReturn(false);
        when(bookingRepository.existsOverlapping(any(), any(), any())).thenReturn(true);

        // WHEN & THEN: Kỳ vọng hệ thống ném ra AppException với mã lỗi BOOKING_OVERLAP
        AppException exception = assertThrows(AppException.class, () -> {
            bookingService.confirmBooking(mockRequest, mockUser);
        });

        assertEquals(ErrorCode.BOOKING_OVERLAP, exception.getErrorCode());
        // Đảm bảo hệ thống KHÔNG lưu vào Database nếu bị trùng
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void confirmBooking_Fail_LockExpired() {
        // GIVEN: lockManager báo là ghế đang bị người khác giữ hoặc mình đã mất quyền (hết hạn)
        when(lockManager.isLockedByOther(any(), any())).thenReturn(true);

        // WHEN & THEN
        AppException exception = assertThrows(AppException.class, () -> {
            bookingService.confirmBooking(mockRequest, mockUser);
        });

        assertEquals(ErrorCode.BOOKING_LOCKED, exception.getErrorCode());
        // Đảm bảo không làm bất kỳ bước nào phía sau (như check DB hay save)
        verify(bookingRepository, never()).existsOverlapping(any(), any(), any());
    }
}
