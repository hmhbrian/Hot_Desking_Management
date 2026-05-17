package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.seat.*;
import com.hoang.hot_desking.entity.Seat;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SeatMapper {

    @Mapping(target = "zone", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    Seat toSeat(SeatRequest request);

    @Mapping(source = "zone.id", target = "zoneId")
    @Mapping(source = "zone.name", target = "zoneName")
    @Mapping(source = "zone.location.name", target = "locationName")
    SeatResponse toSeatResponse(Seat seat);

    List<SeatResponse> toSeatResponseList(List<Seat> seats);

    @Mapping(target = "zone", ignore = true)
    void updateSeat(@MappingTarget Seat seat, SeatRequest request);
}
