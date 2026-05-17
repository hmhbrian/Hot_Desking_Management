package com.hoang.hot_desking.dto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Chỉ gửi trường nào có dữ liệu
public class ApiResponse<T> {
    private int status;         // Mã code tự định nghĩa (VD: 1000 cho thành công)
    private String message;     // Thông báo cho User
    private T result;           // Dữ liệu trả về (Object hoặc List)
}