package com.hoang.hot_desking.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "locations")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Location extends AbstractMappedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    private List<Zone> zones;
}
