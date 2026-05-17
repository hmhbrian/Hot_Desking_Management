package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.department.DepartmentRequest;
import com.hoang.hot_desking.dto.department.DepartmentResponse;
import com.hoang.hot_desking.entity.Department;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.DepartmentMapper;
import com.hoang.hot_desking.repository.DepartmentRepository;
import com.hoang.hot_desking.service.impl.DepartmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DepartmentServiceImplTest {
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private DepartmentMapper departmentMapper;
    @InjectMocks
    private DepartmentServiceImpl departmentService;

    private DepartmentRequest departmentRequest;
    private Department department;
    private DepartmentResponse departmentResponse;

    @BeforeEach
    void initData() {
        departmentRequest = DepartmentRequest.builder()
                .name("Engineering").description("Software Development Team").build();

        department = Department.builder()
                .id(1L).name("Engineering").description("Software Development Team").build();

        departmentResponse = DepartmentResponse.builder()
                .id(1L).name("Engineering").description("Software Development Team").build();
    }

    // ===================== createDepartment =====================

    @Test
    void createDepartment_validRequest_success() {
        // Arrange (Giả lập hành vi)
        when(departmentRepository.existsByName("Engineering")).thenReturn(false);
        when(departmentMapper.toDepartment(any())).thenReturn(department);
        when(departmentRepository.save(any())).thenReturn(department);
        when(departmentMapper.toDepartmentResponse(any())).thenReturn(departmentResponse);

        // Act (Thực hiện hành động)
        DepartmentResponse result = departmentService.createDepartment(departmentRequest);

        // Assert (Kiểm tra kết quả)
        assertThat(result.getName()).isEqualTo("Engineering");
        assertThat(result.getDescription()).isEqualTo("Software Development Team");
        verify(departmentRepository, times(1)).save(any()); // Xác nhận đã gọi save 1 lần
    }

    @Test
    void createDepartment_nameAlreadyExists_throwException() {
        // Arrange
        when(departmentRepository.existsByName("Engineering")).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> departmentService.createDepartment(departmentRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.DEPARTMENT_EXISTED); // 2004
        verify(departmentRepository, never()).save(any()); // Không được gọi save
    }

    // ===================== getAllDepartments =====================

    @Test
    void getAllDepartments_hasData_returnList() {
        // Arrange
        List<Department> departments = List.of(
                department,
                Department.builder().id(2L).name("Marketing").description("Marketing Team").build()
        );
        List<DepartmentResponse> expectedResponses = List.of(
                departmentResponse,
                DepartmentResponse.builder().id(2L).name("Marketing").description("Marketing Team").build()
        );
        when(departmentRepository.findAll()).thenReturn(departments);
        when(departmentMapper.toDepartmentResponseList(departments)).thenReturn(expectedResponses);

        // Act
        List<DepartmentResponse> result = departmentService.getAllDepartments();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Engineering");
        assertThat(result.get(1).getName()).isEqualTo("Marketing");
        verify(departmentRepository, times(1)).findAll();
    }

    @Test
    void getAllDepartments_noData_returnEmptyList() {
        // Arrange
        when(departmentRepository.findAll()).thenReturn(List.of());
        when(departmentMapper.toDepartmentResponseList(List.of())).thenReturn(List.of());

        // Act
        List<DepartmentResponse> result = departmentService.getAllDepartments();

        // Assert
        assertThat(result).isEmpty();
    }

    // ===================== getById =====================

    @Test
    void getById_existingId_returnDepartmentResponse() {
        // Arrange
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(departmentMapper.toDepartmentResponse(department)).thenReturn(departmentResponse);

        // Act
        DepartmentResponse result = departmentService.getById(1L);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Engineering");
    }

    @Test
    void getById_notFound_throwException() {
        // Arrange
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> departmentService.getById(99L));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.DEPARTMENT_NOT_FOUND); // 2003
    }

    // ===================== updateDepartment =====================

    @Test
    void updateDepartment_validRequest_success() {
        // Arrange
        DepartmentRequest updateRequest = DepartmentRequest.builder()
                .name("Engineering Updated").description("Updated Description").build();
        DepartmentResponse updatedResponse = DepartmentResponse.builder()
                .id(1L).name("Engineering Updated").description("Updated Description").build();

        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(departmentRepository.save(any())).thenReturn(department);
        when(departmentMapper.toDepartmentResponse(any())).thenReturn(updatedResponse);

        // Act
        DepartmentResponse result = departmentService.updateDepartment(1L, updateRequest);

        // Assert
        assertThat(result.getName()).isEqualTo("Engineering Updated");
        assertThat(result.getDescription()).isEqualTo("Updated Description");
        verify(departmentMapper, times(1)).updateDepartment(department, updateRequest);
        verify(departmentRepository, times(1)).save(department);
    }

    @Test
    void updateDepartment_notFound_throwException() {
        // Arrange
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> departmentService.updateDepartment(99L, departmentRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.DEPARTMENT_NOT_FOUND); // 2003
        verify(departmentRepository, never()).save(any());
    }

    // ===================== deleteDepartment =====================

    @Test
    void deleteDepartment_existingId_success() {
        // Arrange
        when(departmentRepository.existsById(1L)).thenReturn(true);

        // Act
        departmentService.deleteDepartment(1L);

        // Assert
        verify(departmentRepository, times(1)).deleteById(1L); // Xác nhận đã gọi deleteById đúng 1 lần
    }

    @Test
    void deleteDepartment_notFound_throwException() {
        // Arrange
        when(departmentRepository.existsById(99L)).thenReturn(false);

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> departmentService.deleteDepartment(99L));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.DEPARTMENT_NOT_FOUND); // 2003
        verify(departmentRepository, never()).deleteById(any());
    }
}
