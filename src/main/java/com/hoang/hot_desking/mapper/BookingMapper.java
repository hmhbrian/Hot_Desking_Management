package com.hoang.hot_desking.mapper;

import com.hoang.hot_desking.dto.booking.BookingResponse;
import com.hoang.hot_desking.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(target = "seatNumber", source = "seat.seatNumber")
    BookingResponse toBookingResponse(Booking booking);
}
