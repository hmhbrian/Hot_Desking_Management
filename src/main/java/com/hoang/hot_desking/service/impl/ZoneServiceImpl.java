package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.dto.zone.ZoneRequest;
import com.hoang.hot_desking.dto.zone.ZoneResponse;
import com.hoang.hot_desking.entity.Location;
import com.hoang.hot_desking.entity.Zone;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.ZoneMapper;
import com.hoang.hot_desking.repository.LocationRepository;
import com.hoang.hot_desking.repository.ZoneRepository;
import com.hoang.hot_desking.service.ZoneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ZoneServiceImpl implements ZoneService {
    private final ZoneRepository zoneRepository;
    private final ZoneMapper zoneMapper;
    private final LocationRepository locationRepository;

    @Override
    public ZoneResponse createZone(ZoneRequest request) {
        // Kiểm tra Location có tồn tại không
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        // Kiểm tra trùng tên Zone trong cùng một Location
        if (zoneRepository.existsByNameAndLocationId(request.getName(), request.getLocationId()))
            throw new AppException(ErrorCode.ZONE_EXISTED);

        Zone zone = zoneMapper.toZone(request);
        zone.setLocation(location);

        log.info("Creating new zone: {} in location: {}", request.getName(), location.getName());
        return zoneMapper.toZoneResponse(zoneRepository.save(zone));
    }

    @Override
    public List<ZoneResponse> getAllZones() {
        List<Zone> zones = zoneRepository.findAll();
        return zoneMapper.toZoneResponseList(zones);
    }

    @Override
    public ZoneResponse getById(Long id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ZONE_NOT_FOUND));

        return zoneMapper.toZoneResponse(zone);
    }

    @Override
    public ZoneResponse updateZone(Long id, ZoneRequest request) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ZONE_NOT_FOUND));

        // Kiểm tra Location mới có tồn tại không
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        zoneMapper.updateZone(zone, request);
        zone.setLocation(location);

        return zoneMapper.toZoneResponse(zoneRepository.save(zone));
    }

    @Override
    public void deleteZone(Long id) {
        if (!zoneRepository.existsById(id)) {
            throw new AppException(ErrorCode.ZONE_NOT_FOUND);
        }
        zoneRepository.deleteById(id);
    }
}
