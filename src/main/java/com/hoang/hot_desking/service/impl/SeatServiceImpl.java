package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.dto.seat.SeatBulkRequest;
import com.hoang.hot_desking.dto.seat.SeatRequest;
import com.hoang.hot_desking.dto.seat.SeatResponse;
import com.hoang.hot_desking.entity.Seat;
import com.hoang.hot_desking.entity.Zone;
import com.hoang.hot_desking.entity.enums.SeatStatus;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.SeatMapper;
import com.hoang.hot_desking.repository.SeatRepository;
import com.hoang.hot_desking.repository.ZoneRepository;
import com.hoang.hot_desking.service.SeatService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;
    private final ZoneRepository zoneRepository;
    private final SeatMapper seatMapper;

    @Override
    @Transactional
    public SeatResponse createSeat(SeatRequest request) {
        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new AppException(ErrorCode.ZONE_NOT_FOUND));

        Seat seat = seatMapper.toSeat(request);
        seat.setZone(zone);
        if(seat.getStatus() == null)
            seat.setStatus(SeatStatus.AVAILABLE);

        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }

    @Override
    public void createBulkSeats(SeatBulkRequest request) {
        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new AppException(ErrorCode.ZONE_NOT_FOUND));

        List<Seat> bulkSeats = new ArrayList<>();
        for(int i = 1; i <= request.getQuantity(); i++){
            String seatNumber = String.format("%s-%02d", request.getPrefix(), i);

            Seat seat = Seat.builder()
                    .seatNumber(seatNumber)
                    .features(request.getFeatures())
                    .status(SeatStatus.AVAILABLE)
                    .isActive(true)
                    .zone(zone)
                    .build();

            bulkSeats.add(seat);
        }
        seatRepository.saveAll(bulkSeats);
        log.info("Bulk created {} seats for zone {}", request.getQuantity(), zone.getName());
    }

    @Override
    public List<SeatResponse> getAllByZone(Long zoneId) {
        List<Seat> seats = seatRepository.findByZoneId(zoneId);
        return seatMapper.toSeatResponseList(seats);
    }

    @Override
    @Transactional
    public SeatResponse updateSeat(UUID id, SeatRequest request) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));

        seatMapper.updateSeat(seat,request);

        if(request.getZoneId() != null){
            Zone zone = zoneRepository.findById(request.getZoneId())
                    .orElseThrow(()-> new AppException(ErrorCode.ZONE_NOT_FOUND));
            seat.setZone(zone);
        }
        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }

    @Override
    @Transactional
    public void deleteSeat(UUID id) {
        if (!seatRepository.existsById(id)) {
            throw new AppException(ErrorCode.SEAT_NOT_FOUND);
        }
        seatRepository.deleteById(id);
    }
}
