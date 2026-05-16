package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.dto.PageResponse;
import com.hoang.hot_desking.dto.user.UserResponse;
import com.hoang.hot_desking.dto.user.UserSearchRequest;
import com.hoang.hot_desking.dto.user.UserUpdateRequest;
import com.hoang.hot_desking.entity.User;
import com.hoang.hot_desking.entity.enums.UserRole;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.UserMapper;
import com.hoang.hot_desking.repository.DepartmentRepository;
import com.hoang.hot_desking.repository.UserRepository;
import com.hoang.hot_desking.repository.specification.UserSpecification;
import com.hoang.hot_desking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public User processOAuthPostLogin(String email, String name) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .fullName(name)
                        .role(UserRole.EMPLOYEE)
                        .enabled(true)
                        .build()));
    }

    @Override
    public UserResponse getMyInfo(User currentUser) {
        return userMapper.toUserResponse(currentUser);
    }

    @Override
    public PageResponse<UserResponse> searchUsers(UserSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize(), Sort.by("createdAt").descending());
        Specification<User> spec = UserSpecification.filterUsers(request);
        
        Page<User> userPage = userRepository.findAll(spec, pageable);
        
        return PageResponse.<UserResponse>builder()
                .data(userPage.getContent().stream().map(userMapper::toUserResponse).toList())
                .currentPage(userPage.getNumber() + 1)
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .pageSize(userPage.getSize())
                .build();
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        
        if (request.getDepartmentId() != null) {
            user.setDepartment(departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND)));
        } else {
            user.setDepartment(null);
        }
        
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }
        
        return userMapper.toUserResponse(userRepository.save(user));
    }
}
