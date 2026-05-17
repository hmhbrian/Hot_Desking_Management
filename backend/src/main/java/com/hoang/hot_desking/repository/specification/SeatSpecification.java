package com.hoang.hot_desking.repository.specification;

import com.hoang.hot_desking.dto.seat.SeatFilterRequest;
import com.hoang.hot_desking.entity.Seat;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SeatSpecification {
    public static Specification<Seat> filterSeats(SeatFilterRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.getSeatNumber() != null && !request.getSeatNumber().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("seatNumber")),
                        "%" + request.getSeatNumber().toLowerCase() + "%"));
            }

            if (request.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }

            if (request.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), request.getIsActive()));
            }

            if (request.getZoneId() != null) {
                predicates.add(cb.equal(root.get("zone").get("id"), request.getZoneId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
