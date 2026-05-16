package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.zone.ZoneRequest;
import com.hoang.hot_desking.dto.zone.ZoneResponse;
import com.hoang.hot_desking.entity.Zone;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ZoneMapper {
    @Mapping(target = "location", ignore = true)
    @Mapping(target = "seats", ignore = true)
    Zone toZone(ZoneRequest request);

    @Mapping(source = "location.id", target = "locationId")
    @Mapping(source = "location.name", target = "locationName")
    @Mapping(target = "totalSeats", expression = "java(zone.getSeats() != null ? zone.getSeats().size() : 0)")
    ZoneResponse toZoneResponse(Zone zone);

    @Mapping(target = "location", ignore = true)
    @Mapping(target = "seats", ignore = true)
    void updateZone(@MappingTarget Zone zone, ZoneRequest request);

    List<ZoneResponse> toZoneResponseList(List<Zone> zones);
}
