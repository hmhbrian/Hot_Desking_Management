package com.hoang.hot_desking.dto.location;

import lombok.*;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationResponse {
    private Long id;
    private String name;
    private String address;
}
