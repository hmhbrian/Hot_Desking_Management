package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.dto.department.*;
import com.hoang.hot_desking.service.DepartmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
@Tag(name = "Department", description = "Quản lý phòng ban")
public class DepartmentController {
    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<DepartmentResponse> create(@RequestBody @Valid DepartmentRequest request) {
        return ApiResponse.<DepartmentResponse>builder()
                .status(1000)
                .result(departmentService.createDepartment(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<DepartmentResponse>> getAll() {
        return ApiResponse.<List<DepartmentResponse>>builder()
                .status(1000)
                .result(departmentService.getAllDepartments())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DepartmentResponse> getById(@PathVariable Long id) {
        return ApiResponse.<DepartmentResponse>builder()
                .status(1000)
                .result(departmentService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<DepartmentResponse> update(@PathVariable Long id, @RequestBody DepartmentRequest request) {
        return ApiResponse.<DepartmentResponse>builder()
                .status(1000)
                .result(departmentService.updateDepartment(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> delete(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ApiResponse.<String>builder()
                .status(1000)
                .message("Xóa phòng ban thành công")
                .build();
    }
}
