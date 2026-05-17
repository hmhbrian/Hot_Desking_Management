package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.PageResponse;
import com.hoang.hot_desking.dto.user.UserResponse;
import com.hoang.hot_desking.dto.user.UserSearchRequest;
import com.hoang.hot_desking.dto.user.UserUpdateRequest;
import com.hoang.hot_desking.entity.User;

import java.util.UUID;

public interface UserService {
    User processOAuthPostLogin(String email, String name);
    UserResponse getMyInfo(User currentUser);
    PageResponse<UserResponse> searchUsers(UserSearchRequest request);
    UserResponse updateUser(UUID id, UserUpdateRequest request);
}
