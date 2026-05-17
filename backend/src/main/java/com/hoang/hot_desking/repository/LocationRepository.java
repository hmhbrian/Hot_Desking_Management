package com.hoang.hot_desking.repository;

import com.hoang.hot_desking.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByName(String name);
}
