package com.hoang.hot_desking.service;

import com.hoang.hot_desking.entity.User;

public interface UserService {
    User processOAuthPostLogin(String email, String name);
}

