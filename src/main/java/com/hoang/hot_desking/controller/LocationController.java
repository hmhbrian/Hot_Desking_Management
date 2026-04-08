package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.dto.location.*;
import com.hoang.hot_desking.service.LocationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
@RequiredArgsConstructor
@Tag(name = "Location", description = "Quản lý văn phòng")
public class LocationController {
    private final LocationService locationService;

    @PostMapping
    public ApiResponse<LocationResponse> create(@RequestBody @Valid LocationRequest request) {
        return ApiResponse.<LocationResponse>builder()
                .status(1000)
                .result(locationService.createLocation(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<LocationResponse>> getAll() {
        return ApiResponse.<List<LocationResponse>>builder()
                .status(1000)
                .result(locationService.getAllLocations())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<LocationResponse> getById(@PathVariable Long id) {
        return ApiResponse.<LocationResponse>builder()
                .status(1000)
                .result(locationService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<LocationResponse> update(@PathVariable Long id, @RequestBody LocationRequest request) {
        return ApiResponse.<LocationResponse>builder()
                .status(1000)
                .result(locationService.updateLocation(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ApiResponse.<String>builder()
                .status(1000)
                .message("Xóa văn phòng thành công")
                .build();
    }
}
