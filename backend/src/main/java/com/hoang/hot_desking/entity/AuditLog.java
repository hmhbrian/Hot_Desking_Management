package com.hoang.hot_desking.entity;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String action; // Ví dụ: "CANCEL_BOOKING", "UPDATE_SEAT"

    private String targetType; // Ví dụ: "SEAT", "BOOKING"

    private String targetId;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> oldValue;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> newValue;

    @Column(updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
