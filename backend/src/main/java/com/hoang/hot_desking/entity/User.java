package com.hoang.hot_desking.entity;

import com.hoang.hot_desking.entity.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class User extends AbstractMappedEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    private String fullName;

    @Column(unique = true)
    private String googleId;

    private String pictureUrl;

    @Enumerated(EnumType.STRING)
    private UserRole role; // ADMIN, EMPLOYEE,MANAGER

    private boolean enabled = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}
