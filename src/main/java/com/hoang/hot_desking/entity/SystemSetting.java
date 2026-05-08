package com.hoang.hot_desking.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SystemSetting {
    @Id
    @Column(length = 50)
    private String key;

    @Column(nullable = false)
    private String value;
    private String description;
}
