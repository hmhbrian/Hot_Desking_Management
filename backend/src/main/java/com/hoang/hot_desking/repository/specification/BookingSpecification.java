package com.hoang.hot_desking.repository.specification;

import com.hoang.hot_desking.entity.Booking;
import com.hoang.hot_desking.entity.enums.BookingStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class BookingSpecification {

    public static Specification<Booking> hasStatus(BookingStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) return null;
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    public static Specification<Booking> startTimeAfter(LocalDateTime fromDate) {
        return (root, query, criteriaBuilder) -> {
            if (fromDate == null) return null;
            return criteriaBuilder.greaterThanOrEqualTo(root.get("startTime"), fromDate);
        };
    }

    public static Specification<Booking> startTimeBefore(LocalDateTime toDate) {
        return (root, query, criteriaBuilder) -> {
            if (toDate == null) return null;
            return criteriaBuilder.lessThanOrEqualTo(root.get("startTime"), toDate);
        };
    }
}
