package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.user.UserResponse;
import com.hoang.hot_desking.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    UserResponse toUserResponse(User user);
}
