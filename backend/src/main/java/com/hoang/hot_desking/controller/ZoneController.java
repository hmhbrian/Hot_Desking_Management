package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.dto.zone.*;
import com.hoang.hot_desking.service.ZoneService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/zones")
@RequiredArgsConstructor
@Tag(name = "Zone", description = "Quản lý khu vực")
public class ZoneController {
    private final ZoneService zoneService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<ZoneResponse> create(@RequestBody @Valid ZoneRequest request) {
        return ApiResponse.<ZoneResponse>builder()
                .status(1000)
                .result(zoneService.createZone(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ZoneResponse>> getAll(@RequestParam(required = false) Long locationId) {
        return ApiResponse.<List<ZoneResponse>>builder()
                .status(1000)
                .result(zoneService.getAllZones(locationId))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ZoneResponse> getById(@PathVariable Long id) {
        return ApiResponse.<ZoneResponse>builder()
                .status(1000)
                .result(zoneService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<ZoneResponse> update(@PathVariable Long id, @RequestBody ZoneRequest request) {
        return ApiResponse.<ZoneResponse>builder()
                .status(1000)
                .result(zoneService.updateZone(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> delete(@PathVariable Long id) {
        zoneService.deleteZone(id);
        return ApiResponse.<String>builder()
                .status(1000)
                .message("Xóa khu vực thành công")
                .build();
    }
}
