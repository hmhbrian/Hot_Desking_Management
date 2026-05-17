package com.hoang.hot_desking.controller;

import com.hoang.hot_desking.dto.ApiResponse;
import com.hoang.hot_desking.dto.setting.SettingRequest;
import com.hoang.hot_desking.entity.SystemSetting;
import com.hoang.hot_desking.service.SettingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
@Tag(name = "Admin Settings", description = "API quản trị cấu hình hệ thống (Admin only)")
public class SettingController {
    private final SettingService settingService;

    @Operation(summary = "Cập nhật hoặc tạo mới cấu hình")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> updateSetting(@RequestBody @Valid SettingRequest request) {

        settingService.updateSetting(request.getKey(), request.getValue(), request.getDescription());

        return ApiResponse.<Void>builder()
                .message("Cập nhật cấu hình '" + request.getKey() + "' thành công.")
                .build();
    }

    @Operation(summary = "Liệt kê toàn bộ cấu hình hệ thống")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<SystemSetting>> getAllSettings() {

        List<SystemSetting> settings = settingService.getAllSettings();

        return ApiResponse.<List<SystemSetting>>builder()
                .result(settings)
                .build();
    }
}
