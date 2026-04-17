package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.zone.*;
import com.hoang.hot_desking.entity.*;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.ZoneMapper;
import com.hoang.hot_desking.repository.LocationRepository;
import com.hoang.hot_desking.repository.ZoneRepository;
import com.hoang.hot_desking.service.impl.ZoneServiceImpl;
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
public class ZoneServiceImplTest {
    @Mock
    private ZoneRepository zoneRepository;
    @Mock
    private LocationRepository locationRepository;
    @Mock
    private ZoneMapper zoneMapper;
    @InjectMocks
    private ZoneServiceImpl zoneService;

    private ZoneRequest zoneRequest;
    private Location location;
    private Zone zone;
    private ZoneResponse zoneResponse;

    @BeforeEach
    void initData() {
        zoneRequest = ZoneRequest.builder()
                .name("Quiet Zone").locationId(1L).build();

        location = Location.builder()
                .id(1L).name("Becamex Tower").build();

        zone = Zone.builder()
                .id(1L).name("Quiet Zone").location(location).build();

        zoneResponse = ZoneResponse.builder()
                .id(1L).name("Quiet Zone").locationName("Becamex Tower").build();
    }

    // ===================== createZone =====================

    @Test
    void createZone_validRequest_success() {
        // Arrange (Giả lập hành vi)
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(zoneRepository.existsByNameAndLocationId("Quiet Zone", 1L)).thenReturn(false);
        when(zoneMapper.toZone(any())).thenReturn(zone);
        when(zoneRepository.save(any())).thenReturn(zone);
        when(zoneMapper.toZoneResponse(any())).thenReturn(zoneResponse);

        // Act (Thực hiện hành động)
        ZoneResponse result = zoneService.createZone(zoneRequest);

        // Assert (Kiểm tra kết quả)
        assertThat(result.getName()).isEqualTo("Quiet Zone");
        assertThat(result.getLocationName()).isEqualTo("Becamex Tower");
        verify(zoneRepository, times(1)).save(any()); // Xác nhận đã gọi save 1 lần
    }

    @Test
    void createZone_locationNotFound_throwException() {
        // Arrange
        when(locationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> zoneService.createZone(zoneRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.LOCATION_NOT_FOUND); // 3001
        verify(zoneRepository, never()).save(any()); // Không được gọi save
    }

    @Test
    void createZone_zoneNameAlreadyExistsInLocation_throwException() {
        // Arrange
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(zoneRepository.existsByNameAndLocationId("Quiet Zone", 1L)).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> zoneService.createZone(zoneRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ZONE_EXISTED); // 3005
        verify(zoneRepository, never()).save(any());
    }

    // ===================== getAllZones =====================

    @Test
    void getAllZones_hasData_returnList() {
        // Arrange
        List<Zone> zones = List.of(zone, Zone.builder().id(2L).name("Meeting Room").location(location).build());
        List<ZoneResponse> expectedResponses = List.of(
                zoneResponse,
                ZoneResponse.builder().id(2L).name("Meeting Room").locationName("Becamex Tower").build()
        );
        when(zoneRepository.findAll()).thenReturn(zones);
        when(zoneMapper.toZoneResponseList(zones)).thenReturn(expectedResponses);

        // Act
        List<ZoneResponse> result = zoneService.getAllZones();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Quiet Zone");
        assertThat(result.get(1).getName()).isEqualTo("Meeting Room");
        verify(zoneRepository, times(1)).findAll();
    }

    @Test
    void getAllZones_noData_returnEmptyList() {
        // Arrange
        when(zoneRepository.findAll()).thenReturn(List.of());
        when(zoneMapper.toZoneResponseList(List.of())).thenReturn(List.of());

        // Act
        List<ZoneResponse> result = zoneService.getAllZones();

        // Assert
        assertThat(result).isEmpty();
    }

    // ===================== getById =====================

    @Test
    void getById_existingId_returnZoneResponse() {
        // Arrange
        when(zoneRepository.findById(1L)).thenReturn(Optional.of(zone));
        when(zoneMapper.toZoneResponse(zone)).thenReturn(zoneResponse);

        // Act
        ZoneResponse result = zoneService.getById(1L);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Quiet Zone");
    }

    @Test
    void getById_notFound_throwException() {
        // Arrange
        when(zoneRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> zoneService.getById(99L));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ZONE_NOT_FOUND); // 3004
    }

    // ===================== updateZone =====================

    @Test
    void updateZone_validRequest_success() {
        // Arrange
        ZoneRequest updateRequest = ZoneRequest.builder()
                .name("Quiet Zone Updated").locationId(1L).build();
        ZoneResponse updatedResponse = ZoneResponse.builder()
                .id(1L).name("Quiet Zone Updated").locationName("Becamex Tower").build();

        when(zoneRepository.findById(1L)).thenReturn(Optional.of(zone));
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(zoneRepository.save(any())).thenReturn(zone);
        when(zoneMapper.toZoneResponse(any())).thenReturn(updatedResponse);

        // Act
        ZoneResponse result = zoneService.updateZone(1L, updateRequest);

        // Assert
        assertThat(result.getName()).isEqualTo("Quiet Zone Updated");
        verify(zoneMapper, times(1)).updateZone(zone, updateRequest);
        verify(zoneRepository, times(1)).save(zone);
    }

    @Test
    void updateZone_zoneNotFound_throwException() {
        // Arrange
        when(zoneRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> zoneService.updateZone(99L, zoneRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ZONE_NOT_FOUND); // 3004
        verify(zoneRepository, never()).save(any());
    }

    @Test
    void updateZone_locationNotFound_throwException() {
        // Arrange
        when(zoneRepository.findById(1L)).thenReturn(Optional.of(zone));
        when(locationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> zoneService.updateZone(1L, zoneRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.LOCATION_NOT_FOUND); // 3001
        verify(zoneRepository, never()).save(any());
    }

    // ===================== deleteZone =====================

    @Test
    void deleteZone_existingId_success() {
        // Arrange
        when(zoneRepository.existsById(1L)).thenReturn(true);

        // Act
        zoneService.deleteZone(1L);

        // Assert
        verify(zoneRepository, times(1)).deleteById(1L); // Xác nhận đã gọi deleteById đúng 1 lần
    }

    @Test
    void deleteZone_notFound_throwException() {
        // Arrange
        when(zoneRepository.existsById(99L)).thenReturn(false);

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> zoneService.deleteZone(99L));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ZONE_NOT_FOUND); // 3004
        verify(zoneRepository, never()).deleteById(any());
    }
}
