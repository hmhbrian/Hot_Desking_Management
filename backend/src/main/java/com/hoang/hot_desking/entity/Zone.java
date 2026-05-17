package com.hoang.hot_desking.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "zones")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Zone extends AbstractMappedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL)
    private List<Seat> seats;
}
