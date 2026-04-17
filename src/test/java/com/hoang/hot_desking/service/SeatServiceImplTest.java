package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.seat.SeatBulkRequest;
import com.hoang.hot_desking.dto.seat.SeatRequest;
import com.hoang.hot_desking.dto.seat.SeatResponse;
import com.hoang.hot_desking.entity.Location;
import com.hoang.hot_desking.entity.Seat;
import com.hoang.hot_desking.entity.Zone;
import com.hoang.hot_desking.entity.enums.SeatStatus;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.SeatMapper;
import com.hoang.hot_desking.repository.SeatRepository;
import com.hoang.hot_desking.repository.ZoneRepository;
import com.hoang.hot_desking.service.impl.SeatServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SeatServiceImplTest {
    @Mock
    private SeatRepository seatRepository;
    @Mock
    private ZoneRepository zoneRepository;
    @Mock
    private SeatMapper seatMapper;
    @InjectMocks
    private SeatServiceImpl seatService;

    private UUID seatId;
    private SeatRequest seatRequest;
    private Seat seat;
    private SeatResponse seatResponse;
    private Zone zone;
    private Location location;

    @BeforeEach
    void initData() {
        seatId = UUID.randomUUID();

        location = Location.builder()
                .id(1L).name("Becamex Tower").build();

        zone = Zone.builder()
                .id(1L).name("Quiet Zone").location(location).build();

        seatRequest = SeatRequest.builder()
                .seatNumber("WS-01").zoneId(1L).status(SeatStatus.AVAILABLE).build();

        seat = Seat.builder()
                .id(seatId).seatNumber("WS-01").status(SeatStatus.AVAILABLE).isActive(true).zone(zone).build();

        seatResponse = SeatResponse.builder()
                .id(seatId).seatNumber("WS-01").status(SeatStatus.AVAILABLE)
                .isActive(true).zoneId(1L).zoneName("Quiet Zone").locationName("Becamex Tower").build();
    }

    // ===================== createSeat =====================

    @Test
    void createSeat_validRequest_success() {
        // Arrange (Giả lập hành vi)
        when(zoneRepository.findById(1L)).thenReturn(Optional.of(zone));
        when(seatMapper.toSeat(any())).thenReturn(seat);
        when(seatRepository.save(any())).thenReturn(seat);
        when(seatMapper.toSeatResponse(any())).thenReturn(seatResponse);

        // Act (Thực hiện hành động)
        SeatResponse result = seatService.createSeat(seatRequest);

        // Assert (Kiểm tra kết quả)
        assertThat(result.getSeatNumber()).isEqualTo("WS-01");
        assertThat(result.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
        assertThat(result.getZoneName()).isEqualTo("Quiet Zone");
        verify(seatRepository, times(1)).save(any()); // Xác nhận đã gọi save 1 lần
    }

    @Test
    void createSeat_statusNull_defaultsToAvailable() {
        // Arrange – request không truyền status (null)
        SeatRequest noStatusRequest = SeatRequest.builder()
                .seatNumber("WS-02").zoneId(1L).status(null).build();

        Seat seatNoStatus = Seat.builder()
                .id(UUID.randomUUID()).seatNumber("WS-02").status(null).isActive(true).zone(zone).build();

        when(zoneRepository.findById(1L)).thenReturn(Optional.of(zone));
        when(seatMapper.toSeat(any())).thenReturn(seatNoStatus);
        when(seatRepository.save(any())).thenReturn(seatNoStatus);
        when(seatMapper.toSeatResponse(any())).thenReturn(
                SeatResponse.builder().seatNumber("WS-02").status(SeatStatus.AVAILABLE).build()
        );

        // Act
        SeatResponse result = seatService.createSeat(noStatusRequest);

        // Assert – service phải tự set AVAILABLE khi status null
        assertThat(seatNoStatus.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
        assertThat(result.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
    }

    @Test
    void createSeat_zoneNotFound_throwException() {
        // Arrange
        when(zoneRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> seatService.createSeat(seatRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ZONE_NOT_FOUND); // 3004
        verify(seatRepository, never()).save(any()); // Không được gọi save
    }

    // ===================== createBulkSeats =====================

    @Test
    void createBulkSeats_validRequest_savesCorrectQuantity() {
        // Arrange
        SeatBulkRequest bulkRequest = new SeatBulkRequest();
        bulkRequest.setZoneId(1L);
        bulkRequest.setPrefix("WS");
        bulkRequest.setQuantity(3);

        when(zoneRepository.findById(1L)).thenReturn(Optional.of(zone));

        // Act
        seatService.createBulkSeats(bulkRequest);

        // Assert – phải lưu đúng 3 ghế
        ArgumentCaptor<List<Seat>> captor = ArgumentCaptor.forClass(List.class);
        verify(seatRepository, times(1)).saveAll(captor.capture());
        List<Seat> savedSeats = captor.getValue();
        assertThat(savedSeats).hasSize(3);
        assertThat(savedSeats.get(0).getSeatNumber()).isEqualTo("WS-01");
        assertThat(savedSeats.get(1).getSeatNumber()).isEqualTo("WS-02");
        assertThat(savedSeats.get(2).getSeatNumber()).isEqualTo("WS-03");
    }

    @Test
    void createBulkSeats_allSeatsAreAvailableAndActive() {
        // Arrange
        SeatBulkRequest bulkRequest = new SeatBulkRequest();
        bulkRequest.setZoneId(1L);
        bulkRequest.setPrefix("A");
        bulkRequest.setQuantity(2);

        when(zoneRepository.findById(1L)).thenReturn(Optional.of(zone));

        // Act
        seatService.createBulkSeats(bulkRequest);

        // Assert – mỗi ghế phải là AVAILABLE và isActive = true
        ArgumentCaptor<List<Seat>> captor = ArgumentCaptor.forClass(List.class);
        verify(seatRepository).saveAll(captor.capture());
        captor.getValue().forEach(s -> {
            assertThat(s.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
            assertThat(s.isActive()).isTrue();
            assertThat(s.getZone()).isEqualTo(zone);
        });
    }

    @Test
    void createBulkSeats_zoneNotFound_throwException() {
        // Arrange
        SeatBulkRequest bulkRequest = new SeatBulkRequest();
        bulkRequest.setZoneId(99L);
        bulkRequest.setPrefix("WS");
        bulkRequest.setQuantity(5);

        when(zoneRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> seatService.createBulkSeats(bulkRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ZONE_NOT_FOUND); // 3004
        verify(seatRepository, never()).saveAll(any()); // Không được gọi saveAll
    }

    // ===================== getAllByZone =====================

    @Test
    void getAllByZone_hasSeats_returnList() {
        // Arrange
        Seat seat2 = Seat.builder()
                .id(UUID.randomUUID()).seatNumber("WS-02").status(SeatStatus.AVAILABLE).zone(zone).build();
        List<Seat> seats = List.of(seat, seat2);
        List<SeatResponse> expectedResponses = List.of(
                seatResponse,
                SeatResponse.builder().seatNumber("WS-02").status(SeatStatus.AVAILABLE).zoneId(1L).build()
        );
        when(seatRepository.findByZoneId(1L)).thenReturn(seats);
        when(seatMapper.toSeatResponseList(seats)).thenReturn(expectedResponses);

        // Act
        List<SeatResponse> result = seatService.getAllByZone(1L);

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getSeatNumber()).isEqualTo("WS-01");
        assertThat(result.get(1).getSeatNumber()).isEqualTo("WS-02");
        verify(seatRepository, times(1)).findByZoneId(1L);
    }

    @Test
    void getAllByZone_noSeats_returnEmptyList() {
        // Arrange
        when(seatRepository.findByZoneId(1L)).thenReturn(List.of());
        when(seatMapper.toSeatResponseList(List.of())).thenReturn(List.of());

        // Act
        List<SeatResponse> result = seatService.getAllByZone(1L);

        // Assert
        assertThat(result).isEmpty();
    }

    // ===================== updateSeat =====================

    @Test
    void updateSeat_validRequest_withoutChangingZone_success() {
        // Arrange – request không thay đổi zone (zoneId = null)
        SeatRequest updateRequest = SeatRequest.builder()
                .seatNumber("WS-01-Updated").status(SeatStatus.MAINTENANCE).zoneId(null).build();
        SeatResponse updatedResponse = SeatResponse.builder()
                .id(seatId).seatNumber("WS-01-Updated").status(SeatStatus.MAINTENANCE)
                .zoneId(1L).zoneName("Quiet Zone").build();

        when(seatRepository.findById(seatId)).thenReturn(Optional.of(seat));
        when(seatRepository.save(any())).thenReturn(seat);
        when(seatMapper.toSeatResponse(any())).thenReturn(updatedResponse);

        // Act
        SeatResponse result = seatService.updateSeat(seatId, updateRequest);

        // Assert
        assertThat(result.getSeatNumber()).isEqualTo("WS-01-Updated");
        assertThat(result.getStatus()).isEqualTo(SeatStatus.MAINTENANCE);
        verify(seatMapper, times(1)).updateSeat(seat, updateRequest);
        verify(zoneRepository, never()).findById(any()); // Không tra cứu zone mới
        verify(seatRepository, times(1)).save(seat);
    }

    @Test
    void updateSeat_validRequest_withNewZone_success() {
        // Arrange – request đổi sang zone mới (zoneId = 2L)
        Zone newZone = Zone.builder().id(2L).name("Meeting Room").location(location).build();
        SeatRequest updateRequest = SeatRequest.builder()
                .seatNumber("WS-01").status(SeatStatus.AVAILABLE).zoneId(2L).build();
        SeatResponse updatedResponse = SeatResponse.builder()
                .id(seatId).seatNumber("WS-01").status(SeatStatus.AVAILABLE)
                .zoneId(2L).zoneName("Meeting Room").build();

        when(seatRepository.findById(seatId)).thenReturn(Optional.of(seat));
        when(zoneRepository.findById(2L)).thenReturn(Optional.of(newZone));
        when(seatRepository.save(any())).thenReturn(seat);
        when(seatMapper.toSeatResponse(any())).thenReturn(updatedResponse);

        // Act
        SeatResponse result = seatService.updateSeat(seatId, updateRequest);

        // Assert
        assertThat(result.getZoneName()).isEqualTo("Meeting Room");
        assertThat(seat.getZone()).isEqualTo(newZone); // Ghế đã được cập nhật zone mới
        verify(zoneRepository, times(1)).findById(2L);
    }

    @Test
    void updateSeat_seatNotFound_throwException() {
        // Arrange
        when(seatRepository.findById(seatId)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> seatService.updateSeat(seatId, seatRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.SEAT_NOT_FOUND); // 3008
        verify(seatRepository, never()).save(any());
    }

    @Test
    void updateSeat_newZoneNotFound_throwException() {
        // Arrange – seat tồn tại nhưng zone mới không tồn tại
        SeatRequest updateRequest = SeatRequest.builder()
                .seatNumber("WS-01").status(SeatStatus.AVAILABLE).zoneId(99L).build();

        when(seatRepository.findById(seatId)).thenReturn(Optional.of(seat));
        when(zoneRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> seatService.updateSeat(seatId, updateRequest));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ZONE_NOT_FOUND); // 3004
        verify(seatRepository, never()).save(any());
    }

    // ===================== deleteSeat =====================

    @Test
    void deleteSeat_existingId_success() {
        // Arrange
        when(seatRepository.existsById(seatId)).thenReturn(true);

        // Act
        seatService.deleteSeat(seatId);

        // Assert
        verify(seatRepository, times(1)).deleteById(seatId); // Xác nhận đã gọi deleteById đúng 1 lần
    }

    @Test
    void deleteSeat_notFound_throwException() {
        // Arrange
        UUID randomId = UUID.randomUUID();
        when(seatRepository.existsById(randomId)).thenReturn(false);

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> seatService.deleteSeat(randomId));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.SEAT_NOT_FOUND); // 3008
        verify(seatRepository, never()).deleteById(any()); // Không được gọi deleteById
    }
}
