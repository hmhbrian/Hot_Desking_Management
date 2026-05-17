package com.hoang.hot_desking.dto.department;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class DepartmentRequest {
    @NotBlank(message = "DEPARTMENT_NAME_INVALID")
    private String name;

    private String description;
}
