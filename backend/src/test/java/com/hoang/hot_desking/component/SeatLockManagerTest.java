package com.hoang.hot_desking.component;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class SeatLockManagerTest {
    @Autowired
    private SeatLockManager lockManager;

    @Test
    void testLockFlow(){
        UUID seatId = UUID.randomUUID();
        UUID userA = UUID.randomUUID();
        UUID userB = UUID.randomUUID();

        // 1. User A giữ chỗ thành công
        boolean firstLock = lockManager.acquireLock(seatId, userA, 1);
        assertTrue(firstLock);

        // 2. User B giữ chỗ cùng ghế đó -> Thất bại
        boolean secondLock = lockManager.acquireLock(seatId, userB, 1);
        assertFalse(secondLock);

        // 3. Kiểm tra xem có đúng là User B bị chặn không
        assertTrue(lockManager.isLockedByOther(seatId, userB));

        // 4. Giải phóng khóa và User B có thể giữ lại
        lockManager.releaseLock(seatId);
        assertTrue(lockManager.acquireLock(seatId, userB, 1));
    }
}
