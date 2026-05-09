package com.hoang.hot_desking.service;

import com.hoang.hot_desking.entity.SystemSetting;

import java.util.List;

//Cung cấp các phương thức truy xuất tham số vận hành (như thời gian timeout, biên độ check-in).
public interface SettingService {
    /**
     * Lấy giá trị cấu hình kiểu String.
     * @param key Mã định danh của tham số (ví dụ: 'SITE_NAME').
     * @param defaultValue Giá trị trả về mặc định nếu không tìm thấy trong DB.
     * @return Chuỗi giá trị của tham số.
     */
    String getString(String key, String defaultValue);

    /**
     * Lấy giá trị cấu hình và ép kiểu sang Integer.
     * @param key Mã định danh của tham số (ví dụ: 'AUTO_RELEASE_TIMEOUT').
     * @param defaultValue Giá trị mặc định nếu không tìm thấy.
     * @return Giá trị số nguyên của tham số.
     */
    Integer getInteger(String key, Integer defaultValue);

    /**
     * Cập nhật hoặc tạo mới một tham số cấu hình.
     * @param key Mã định danh tham số.
     * @param value Giá trị mới cần lưu.
     */
    void updateSetting(String key, String value, String description);

    //Lấy danh sách các setting
    List<SystemSetting> getAllSettings();
}
