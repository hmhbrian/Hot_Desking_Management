package com.hoang.hot_desking.dto.location;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationRequest {
    @NotBlank(message = "LOCATION_NAME_INVALID")
    private String name;

    private String address;
}
