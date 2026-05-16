package com.hoang.hot_desking.repository;

import com.hoang.hot_desking.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    boolean existsByNameAndLocationId(String name, Long locationId);
    List<Zone> findByLocationId(Long locationId);
}
