package com.hoang.hot_desking.dto.department;

import lombok.*;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
}
