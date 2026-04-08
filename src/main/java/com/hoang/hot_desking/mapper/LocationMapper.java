package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.location.LocationRequest;
import com.hoang.hot_desking.dto.location.LocationResponse;
import com.hoang.hot_desking.entity.Location;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    Location toLocation(LocationRequest request);

    LocationResponse toLocationResponse(Location location);

    void updateLocation(@MappingTarget Location location, LocationRequest request);

    List<LocationResponse> toLocationResponseList(List<Location> locations);
}
