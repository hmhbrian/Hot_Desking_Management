package com.hoang.hot_desking.repository;

import com.hoang.hot_desking.entity.Location;
import com.hoang.hot_desking.entity.Seat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface SeatRepository extends JpaRepository<Seat, UUID> {
    List<Seat> findByZoneId(long zoneId);

    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    @Query("SELECT s FROM Seat s WHERE s.id = :id")
    Optional<Seat> findByIdWithLock(UUID id);

}
