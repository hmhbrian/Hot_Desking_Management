package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.location.LocationRequest;
import com.hoang.hot_desking.dto.location.LocationResponse;

import java.util.List;

public interface LocationService {
    LocationResponse createLocation(LocationRequest request);
    List<LocationResponse> getAllLocations();
    LocationResponse getById(Long id);
    LocationResponse updateLocation(Long id, LocationRequest request);
    void deleteLocation(Long id);
}
