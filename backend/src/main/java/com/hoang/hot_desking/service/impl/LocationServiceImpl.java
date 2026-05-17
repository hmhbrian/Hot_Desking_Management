package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.dto.location.LocationRequest;
import com.hoang.hot_desking.dto.location.LocationResponse;
import com.hoang.hot_desking.entity.Location;
import com.hoang.hot_desking.exception.AppException;
import com.hoang.hot_desking.exception.ErrorCode;
import com.hoang.hot_desking.mapper.LocationMapper;
import com.hoang.hot_desking.repository.LocationRepository;
import com.hoang.hot_desking.service.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    @Override
    public LocationResponse createLocation(LocationRequest request) {
        if (locationRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.LOCATION_EXISTED);

        Location location = locationMapper.toLocation(request);

        log.info("Creating new location: {}", request.getName());
        return locationMapper.toLocationResponse(locationRepository.save(location));
    }

    @Override
    public List<LocationResponse> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return locationMapper.toLocationResponseList(locations);
    }

    @Override
    public LocationResponse getById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        return locationMapper.toLocationResponse(location);
    }

    @Override
    public LocationResponse updateLocation(Long id, LocationRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_FOUND));

        locationMapper.updateLocation(location, request);

        return locationMapper.toLocationResponse(locationRepository.save(location));
    }

    @Override
    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new AppException(ErrorCode.LOCATION_NOT_FOUND);
        }
        locationRepository.deleteById(id);
    }
}
