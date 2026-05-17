package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.dto.department.DepartmentRequest;
import com.hoang.hot_desking.dto.department.DepartmentResponse;
import com.hoang.hot_desking.entity.Department;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.DepartmentMapper;
import com.hoang.hot_desking.repository.DepartmentRepository;
import com.hoang.hot_desking.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if(departmentRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.DEPARTMENT_EXISTED);
//        Department department = Department.builder()
//                .name(request.getName())
//                .description(request.getDescription())
//                .build();
        Department department = departmentMapper.toDepartment(request);

        log.info("Creating new department: {}", request.getName());
//        return mapToResponse(departmentRepository.save(department));
        return departmentMapper.toDepartmentResponse(departmentRepository.save(department));
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departmentMapper.toDepartmentResponseList(departments);
    }

    @Override
    public DepartmentResponse getById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        return departmentMapper.toDepartmentResponse(department);
    }

    @Override
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        // Tự động cập nhật các trường từ request vào entity hiện tại
        departmentMapper.updateDepartment(department, request);

        return departmentMapper.toDepartmentResponse(departmentRepository.save(department));
    }

    @Override
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new AppException(ErrorCode.DEPARTMENT_NOT_FOUND);
        }
        departmentRepository.deleteById(id);
    }

    // Hàm bổ trợ convert Entity sang DTO (Private)
    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .build();
    }
}
