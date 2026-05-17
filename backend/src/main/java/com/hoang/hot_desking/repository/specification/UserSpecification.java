package com.hoang.hot_desking.repository.specification;

import com.hoang.hot_desking.dto.user.UserSearchRequest;
import com.hoang.hot_desking.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<User> filterUsers(UserSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            // Fetch join department to avoid N+1 and lazy loading issues during mapping
            if (Long.class != query.getResultType()) {
                root.fetch("department", jakarta.persistence.criteria.JoinType.LEFT);
            }
            
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(request.getQuery())) {
                String searchPattern = "%" + request.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern)
                ));
            }

            if (request.getRole() != null) {
                predicates.add(criteriaBuilder.equal(root.get("role"), request.getRole()));
            }

            if (request.getDepartmentId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("department").get("id"), request.getDepartmentId()));
            }

            if (request.getEnabled() != null) {
                predicates.add(criteriaBuilder.equal(root.get("enabled"), request.getEnabled()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
