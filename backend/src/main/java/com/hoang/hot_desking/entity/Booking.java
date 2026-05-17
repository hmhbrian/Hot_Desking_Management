package com.hoang.hot_desking.entity;

import com.hoang.hot_desking.entity.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter @Setter @Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking extends AbstractMappedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // CONFIRMED, CHECKED_IN, CANCELLED, NO_SHOW

    private LocalDateTime checkInAt;
    private LocalDateTime checkOutAt;

    @Column(unique = true)
    private String qrToken; // Token dùng để tạo mã QR check-in
}
