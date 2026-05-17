package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.dto.PageResponse;
import com.hoang.hot_desking.dto.user.UserResponse;
import com.hoang.hot_desking.dto.user.UserSearchRequest;
import com.hoang.hot_desking.dto.user.UserUpdateRequest;
import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "Quản lý người dùng và thông tin cá nhân")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin người dùng hiện tại", description = "Sử dụng JWT token để lấy thông tin chi tiết của user đang đăng nhập")
    public ApiResponse<UserResponse> getMyInfo(@AuthenticationPrincipal User currentUser) {
        return ApiResponse.<UserResponse>builder()
                .status(1000)
                .result(userService.getMyInfo(currentUser))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách người dùng (Admin)", description = "Lấy danh sách người dùng với các bộ lọc và phân trang")
    public ApiResponse<PageResponse<UserResponse>> searchUsers(UserSearchRequest request) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .status(1000)
                .result(userService.searchUsers(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật thông tin người dùng (Admin)", description = "Admin cập nhật vai trò, phòng ban và trạng thái hoạt động của người dùng")
    public ApiResponse<UserResponse> updateUser(@PathVariable UUID id, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .status(1000)
                .result(userService.updateUser(id, request))
                .build();
    }
}
