package com.hoang.hot_desking.repository;

import com.hoang.hot_desking.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    /**
     * Kiểm tra chồng lấn thời gian (Overlap Check).
     * Một Booking bị coi là trùng nếu: (Start < End_DB) AND (End > Start_DB)
     */
    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "WHERE b.seat.id = :seatId " +
            "AND b.status IN ('CONFIRMED', 'CHECKED_IN') " +
            "AND (:startTime < b.endTime AND :endTime > b.startTime)")
    boolean existsOverlapping(UUID seatId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Kiểm tra Hạn mức (Quota): Mỗi nhân viên chỉ được đặt tối đa 1 chỗ trong cùng khung giờ.
     */
    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "WHERE b.user.id = :userId " +
            "AND b.status IN ('CONFIRMED', 'CHECKED_IN') " +
            "AND (:startTime < b.endTime AND :endTime > b.startTime)")
    boolean existsByUserAndOverlap(UUID userId, LocalDateTime startTime, LocalDateTime endTime);

    // Lấy danh sách booking của một user, sắp xếp mới nhất lên đầu
    Page<Booking> findByUserIdOrderByStartTimeDesc(UUID userId, Pageable pageable);

    // Lấy booking kèm theo Seat và Zone (tránh lỗi N+1 khi hiển thị)
    @Query("SELECT b FROM Booking b JOIN FETCH b.seat s JOIN FETCH s.zone WHERE b.id = :id AND b.user.id = :userId")
    Optional<Booking> findByIdAndUserIdWithDetails(UUID id, UUID userId);
}
