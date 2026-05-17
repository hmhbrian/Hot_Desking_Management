package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.department.DepartmentRequest;
import com.hoang.hot_desking.dto.department.DepartmentResponse;
import com.hoang.hot_desking.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring") // MapStruct tạo ra một Bean cho Spring quản lý
public interface DepartmentMapper {
    // Tự động map từ Request DTO sang Entity để lưu vào DB
    Department toDepartment(DepartmentRequest request);

    // Tự động map từ Entity sang Response DTO để trả về cho FE
    DepartmentResponse toDepartmentResponse(Department department);

    // Cập nhật Entity từ Request (Dùng cho hàm Update)
    void updateDepartment(@MappingTarget Department department, DepartmentRequest request);

    List<DepartmentResponse> toDepartmentResponseList(List<Department> departments);
}
