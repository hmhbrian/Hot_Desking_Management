package com.hoang.hot_desking.dto.user;

import com.hoang.hot_desking.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchRequest {
    private String query;
    private UserRole role;
    private Long departmentId;
    private Boolean enabled;
    
    @Builder.Default
    private int page = 1;
    
    @Builder.Default
    private int size = 10;
}
