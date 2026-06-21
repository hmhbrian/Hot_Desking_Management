package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.booking.AdminBookingResponse;
import com.hoang.hot_desking.dto.booking.BookingDetailResponse;
import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(target = "seatNumber", source = "seat.seatNumber")
    BookingResponse toBookingResponse(Booking booking);

    @Mapping(source = "seat.seatNumber", target = "seat.seatNumber")
    @Mapping(source = "seat.features", target = "seat.features")
    @Mapping(source = "seat.zone.name", target = "zone.name")
    @Mapping(source = "seat.zone.id", target = "zone.id")
    BookingDetailResponse toDetailResponse(Booking booking);

    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "seat.seatNumber", target = "seatNumber")
    @Mapping(source = "seat.zone.name", target = "zoneName")
    @Mapping(source = "seat.zone.location.name", target = "locationName")
    AdminBookingResponse toAdminBookingResponse(Booking booking);
}
