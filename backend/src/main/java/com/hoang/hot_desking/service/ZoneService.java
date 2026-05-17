package com.hoang.hot_desking.service;

import com.hoang.hot_desking.dto.zone.ZoneRequest;
import com.hoang.hot_desking.dto.zone.ZoneResponse;

import java.util.List;

public interface ZoneService {
    ZoneResponse createZone(ZoneRequest request);
    List<ZoneResponse> getAllZones(Long locationId);
    ZoneResponse getById(Long id);
    ZoneResponse updateZone(Long id, ZoneRequest request);
    void deleteZone(Long id);
}
