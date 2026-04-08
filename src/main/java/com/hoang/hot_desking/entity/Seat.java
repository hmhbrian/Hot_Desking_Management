package com.hoang.hot_desking.entity;

import com.hoang.hot_desking.entity.enums.SeatStatus;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "seats")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Seat extends AbstractMappedEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String seatNumber;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> features; // Ví dụ: {"monitor": 2, "type": "standing"}

    @Enumerated(EnumType.STRING)
    private SeatStatus status; // AVAILABLE, MAINTENANCE, LOCKED

    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @Version
    private Long version; // Chống ghi đè dữ liệu đồng thời
}
