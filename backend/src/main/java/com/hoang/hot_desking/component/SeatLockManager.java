package com.hoang.hot_desking.component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class SeatLockManager {
    private final StringRedisTemplate redisTemplate;
    private static final String LOCK_PREFIX = "seat_lock";

    /**
     * Thực hiện giữ chỗ tạm thời trên Redis (SETNX với TTL).
     * @param seatId Id của ghế cần giữ
     * @param userId Id của nhân viên đang thao tác
     * @param minutes Thời gian giữ chỗ (5')
     * @return true nếu giữ chỗ thành công, false nếu ghế đã bị người khác giữ
     * */
    public boolean acquireLock(UUID seatId, UUID userId, int minutes){
        String key = LOCK_PREFIX + seatId.toString();

        Boolean success = redisTemplate.opsForValue().setIfAbsent(
                key,
                userId.toString(),
                Duration.ofMinutes(minutes)
        );

        if (Boolean.TRUE.equals(success)){
            log.info("User {} đã giữ chỗ tạm thời ghế {} trong {} phút",userId,seatId,minutes);
        }
        return Boolean.TRUE.equals(success);
    }

    /**
     * Kiểm tra xem ghế có đang bị người KHÁC giữ hay không.
     */
    public boolean isLockedByOther(UUID seatId, UUID userId) {
        String key = LOCK_PREFIX + seatId.toString();
        String lockedBy = redisTemplate.opsForValue().get(key);

        // Ghế bị khóa bởi người khác khi: key tồn tại AND giá trị khác với userId hiện tại
        return lockedBy != null && !lockedBy.equals(userId.toString());
    }

    /**
     * Giải phóng khóa (Xóa key trên Redis).
     * Dùng khi User hoàn tất đặt chỗ hoặc chủ động hủy thao tác.
     */
    public void releaseLock(UUID seatId) {
        redisTemplate.delete(LOCK_PREFIX + seatId.toString());
        log.info("Đã giải phóng khóa cho ghế {}", seatId);
    }
}
