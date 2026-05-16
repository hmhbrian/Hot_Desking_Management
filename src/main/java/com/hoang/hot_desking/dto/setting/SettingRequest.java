package com.hoang.hot_desking.dto.setting;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SettingRequest {
    @NotBlank(message = "Key không được để trống")
    private String key;

    @NotBlank(message = "Value không được để trống")
    private String value;
    private String description;
}
