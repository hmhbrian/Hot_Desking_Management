package com.hoang.hot_desking.dto.zone;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class ZoneRequest {
    @NotBlank(message = "ZONE_NAME_INVALID")
    private String name;

    private String description;

    @NotNull(message = "ZONE_LOCATION_INVALID")
    private Long locationId;
}
