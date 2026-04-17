package com.hoang.hot_desking.repository;

import com.hoang.hot_desking.entity.Location;
import com.hoang.hot_desking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface SeatRepository extends JpaRepository<Seat, UUID> {
    List<Seat> findByZoneId(long zoneId);

}
