package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.location.LocationRequest;
import com.hoang.hot_desking.dto.location.LocationResponse;
import com.hoang.hot_desking.entity.Location;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.LocationMapper;
import com.hoang.hot_desking.repository.LocationRepository;
import com.hoang.hot_desking.service.impl.LocationServiceImpl;
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
public class LocationServiceImplTest {
    @Mock
    private LocationRepository locationRepository;
    @Mock
    private LocationMapper locationMapper;
    @InjectMocks
    private LocationServiceImpl locationService;

    private LocationRequest locationRequest;
    private Location location;
    private LocationResponse locationResponse;

    @BeforeEach
    void initData() {
        locationRequest = LocationRequest.builder()
                .name("Becamex Tower").address("Binh Duong").build();

        location = Location.builder()
                .id(1L).name("Becamex Tower").address("Binh Duong").build();

        locationResponse = LocationResponse.builder()
                .id(1L).name("Becamex Tower").address("Binh Duong").build();
    }

    // ===================== createLocation =====================

    @Test
    void createLocation_validRequest_success() {
        // Arrange (Giả lập hành vi)
        when(locationRepository.existsByName("Becamex Tower")).thenReturn(false);
        when(locationMapper.toLocation(any())).thenReturn(location);
        when(locationRepository.save(any())).thenReturn(location);
        when(locationMapper.toLocationResponse(any())).thenReturn(locationResponse);

        // Act (Thực hiện hành động)
        LocationResponse result = locationService.createLocation(locationRequest);

        // Assert (Kiểm tra kết quả)
        assertThat(result.getName()).isEqualTo("Becamex Tower");
        assertThat(result.getAddress()).isEqualTo("Binh Duong");
        verify(locationRepository, times(1)).save(any()); // Xác nhận đã gọi save 1 lần
    }

    @Test
    void createLocation_nameAlreadyExists_throwException() {
        // Arrange
        when(locationRepository.existsByName("Becamex Tower")).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> locationService.createLocation(locationRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.LOCATION_EXISTED); // 3002
        verify(locationRepository, never()).save(any()); // Không được gọi save
    }

    // ===================== getAllLocations =====================

    @Test
    void getAllLocations_hasData_returnList() {
        // Arrange
        List<Location> locations = List.of(
                location,
                Location.builder().id(2L).name("Vinhomes Grand Park").address("Ho Chi Minh").build()
        );
        List<LocationResponse> expectedResponses = List.of(
                locationResponse,
                LocationResponse.builder().id(2L).name("Vinhomes Grand Park").address("Ho Chi Minh").build()
        );
        when(locationRepository.findAll()).thenReturn(locations);
        when(locationMapper.toLocationResponseList(locations)).thenReturn(expectedResponses);

        // Act
        List<LocationResponse> result = locationService.getAllLocations();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Becamex Tower");
        assertThat(result.get(1).getName()).isEqualTo("Vinhomes Grand Park");
        verify(locationRepository, times(1)).findAll();
    }

    @Test
    void getAllLocations_noData_returnEmptyList() {
        // Arrange
        when(locationRepository.findAll()).thenReturn(List.of());
        when(locationMapper.toLocationResponseList(List.of())).thenReturn(List.of());

        // Act
        List<LocationResponse> result = locationService.getAllLocations();

        // Assert
        assertThat(result).isEmpty();
    }

    // ===================== getById =====================

    @Test
    void getById_existingId_returnLocationResponse() {
        // Arrange
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(locationMapper.toLocationResponse(location)).thenReturn(locationResponse);

        // Act
        LocationResponse result = locationService.getById(1L);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Becamex Tower");
    }

    @Test
    void getById_notFound_throwException() {
        // Arrange
        when(locationRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> locationService.getById(99L));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.LOCATION_NOT_FOUND); // 3001
    }

    // ===================== updateLocation =====================

    @Test
    void updateLocation_validRequest_success() {
        // Arrange
        LocationRequest updateRequest = LocationRequest.builder()
                .name("Becamex Tower Updated").address("Binh Duong Province").build();
        LocationResponse updatedResponse = LocationResponse.builder()
                .id(1L).name("Becamex Tower Updated").address("Binh Duong Province").build();

        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(locationRepository.save(any())).thenReturn(location);
        when(locationMapper.toLocationResponse(any())).thenReturn(updatedResponse);

        // Act
        LocationResponse result = locationService.updateLocation(1L, updateRequest);

        // Assert
        assertThat(result.getName()).isEqualTo("Becamex Tower Updated");
        assertThat(result.getAddress()).isEqualTo("Binh Duong Province");
        verify(locationMapper, times(1)).updateLocation(location, updateRequest);
        verify(locationRepository, times(1)).save(location);
    }

    @Test
    void updateLocation_notFound_throwException() {
        // Arrange
        when(locationRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> locationService.updateLocation(99L, locationRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.LOCATION_NOT_FOUND); // 3001
        verify(locationRepository, never()).save(any());
    }

    // ===================== deleteLocation =====================

    @Test
    void deleteLocation_existingId_success() {
        // Arrange
        when(locationRepository.existsById(1L)).thenReturn(true);

        // Act
        locationService.deleteLocation(1L);

        // Assert
        verify(locationRepository, times(1)).deleteById(1L); // Xác nhận đã gọi deleteById đúng 1 lần
    }

    @Test
    void deleteLocation_notFound_throwException() {
        // Arrange
        when(locationRepository.existsById(99L)).thenReturn(false);

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> locationService.deleteLocation(99L));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.LOCATION_NOT_FOUND); // 3001
        verify(locationRepository, never()).deleteById(any());
    }
}
