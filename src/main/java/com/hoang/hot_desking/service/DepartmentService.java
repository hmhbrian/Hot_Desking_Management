package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.department.DepartmentRequest;
import com.hoang.hot_desking.dto.department.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse createDepartment(DepartmentRequest request);
    List<DepartmentResponse> getAllDepartments();
    DepartmentResponse getById(Long id);
    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
}
