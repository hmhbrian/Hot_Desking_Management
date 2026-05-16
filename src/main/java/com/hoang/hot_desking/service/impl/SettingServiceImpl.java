package com.hoang.hot_desking.service.impl;

import com.hoang.hot_desking.entity.SystemSetting;
import com.hoang.hot_desking.repository.SystemSettingRepository;
import com.hoang.hot_desking.service.SettingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettingServiceImpl implements SettingService {
    private final SystemSettingRepository settingRepository;
    /**
     * Lấy cấu hình chuỗi với cơ chế Cache-Aside:
     * 1. Kiểm tra trong Redis với key 'settings::[key]'.
     * 2. Nếu có (Cache Hit): Trả về ngay lập tức, không xuống DB.
     * 3. Nếu không (Cache Miss): Chạy vào hàm, lấy từ DB, lưu vào Redis rồi mới trả về.
     */
    @Override
    public String getString(String key, String defaultValue) {
        log.info("Cache miss cho key: {}. Đang truy vấn Database...", key);

        return settingRepository.findById(key)
                .map(SystemSetting::getValue)
                .orElse(defaultValue);
    }

    /**
     * Phương thức tiện ích để lấy cấu hình số.
     * Tận dụng lại hàm getString để sử dụng cơ chế Cache.
     */
    @Override
    public Integer getInteger(String key, Integer defaultValue) {
        String val = getString(key, defaultValue.toString());
        try {
            return Integer.parseInt(val);
        } catch (NumberFormatException e) {
            log.error("Lỗi định dạng số cho key {}: {}. Trả về mặc định: {}", key, val, defaultValue);
            return defaultValue;
        }
    }

    /**
     * Cập nhật cấu hình và đồng bộ hóa Cache:
     * @CacheEvict: Xóa bản ghi tương ứng trong Redis sau khi lưu DB thành công.
     * Việc xóa cache (Invalidation) quan trọng hơn cập nhật cache để tránh dữ liệu cũ (Stale data).
     */
    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "settings", key = "#key"),
            @CacheEvict(value = "settings_list", allEntries = true) // Xóa sạch cache danh sách khi có 1 cái thay đổi
    })
    public void updateSetting(String key, String value, String description) {
        SystemSetting setting = settingRepository.findById(key)
                .orElse(SystemSetting.builder().key(key).build());

        setting.setValue(value);

        if (description != null && !description.isBlank()) {
            setting.setDescription(description);
        }

        settingRepository.save(setting);

        log.info("Đã cập nhật cấu hình: {} = {}. Redis cache đã được làm mới.", key, value);
    }

    @Override
    @Cacheable(value = "settings_list")
    public List<SystemSetting> getAllSettings() {
        log.info("Cache miss: Đang lấy toàn bộ danh sách settings từ DB...");
        return settingRepository.findAll();
    }
}
