package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.location.LocationRequest;
import com.hoang.hot_desking.dto.location.LocationResponse;
import com.hoang.hot_desking.entity.Location;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", imports = {java.util.stream.Collectors.class, java.util.stream.Stream.class})
public interface LocationMapper {
    Location toLocation(LocationRequest request);

    @org.mapstruct.Mapping(target = "totalZones", expression = "java(location.getZones() != null ? location.getZones().size() : 0)")
    @org.mapstruct.Mapping(target = "totalSeats", expression = "java(location.getZones() != null ? location.getZones().stream().filter(z -> z.getSeats() != null).flatMap(z -> z.getSeats().stream()).count() : 0)")
    LocationResponse toLocationResponse(Location location);

    void updateLocation(@MappingTarget Location location, LocationRequest request);

    List<LocationResponse> toLocationResponseList(List<Location> locations);
}
