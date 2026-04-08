package com.hoang.hot_desking.dto.zone;

import lombok.*;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class ZoneResponse {
    private Long id;
    private String name;
    private String description;
    private Long locationId;
    private String locationName;
}
