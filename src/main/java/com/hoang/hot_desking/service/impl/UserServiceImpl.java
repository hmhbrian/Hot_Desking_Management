package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.entity.enums.UserRole;
import com.hoang.hot_desking.repository.UserRepository;
import com.hoang.hot_desking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Override
    public User processOAuthPostLogin(String email, String name) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .fullName(name)
                        .role(UserRole.EMPLOYEE)
                        .enabled(true)
                        .build()));
    }
}
