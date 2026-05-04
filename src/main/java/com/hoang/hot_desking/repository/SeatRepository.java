package com.hoang.hot_desking.repository;

import com.hoang.hot_desking.entity.Location;
import com.hoang.hot_desking.entity.Seat;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
public interface SeatRepository extends JpaRepository<Seat, UUID> {
    List<Seat> findByZoneId(long zoneId);

    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    @Query("SELECT s FROM Seat s WHERE s.id = :id")
    Optional<Seat> findByIdWithLock(UUID id);

    @Query(value = """
        SELECT s.* FROM seats s
        WHERE s.is_active = true
        AND s.status = 'AVAILABLE'
        AND (:zoneId IS NULL OR s.zone_id = :zoneId)
        -- Lọc JSONB: Tìm ghế có số màn hình >= minMonitors (nếu có)
        AND (:minMonitors IS NULL OR (s.features ->> 'monitor')::int >= :minMonitors)
        -- Lọc JSONB: Tìm loại ghế (nếu có)
        AND (:seatType IS NULL OR s.features ->> 'type' = :seatType)
        -- KHÔNG tồn tại Booking nào trùng lịch
        AND NOT EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.seat_id = s.id
            AND b.status = 'CONFIRMED'
            AND (:startTime < b.end_time AND :endTime > b.start_time)
        )
    """, nativeQuery = true)
    List<Seat> searchAvailableSeats(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("zoneId") Integer zoneId,
            @Param("minMonitors") Integer minMonitors,
            @Param("seatType") String seatType
    );

}
