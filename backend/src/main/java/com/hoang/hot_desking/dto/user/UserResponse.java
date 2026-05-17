package com.hoang.hot_desking.dto.user;

import com.hoang.hot_desking.entity.enums.UserRole;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String googleId;
    private String pictureUrl;
    private UserRole role;
    private boolean enabled;
    private Long departmentId;
    private String departmentName;
}
