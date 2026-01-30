package com.crcs.resourceservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private ResourceType type;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ResourceStatus status = ResourceStatus.AVAILABLE;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "owner_id", length = 36)
    private String ownerId;

    @Column(name = "responsible_person", length = 255)
    private String responsiblePerson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ResourceType {
        ROOM,
        LAB,
        HALL,
        EQUIPMENT,
        CAFETERIA,
        LIBRARY,
        PARKING,
        SPORTS
    }

    public enum ResourceStatus {
        AVAILABLE,
        BOOKED,
        MAINTENANCE,
        UNAVAILABLE
    }
}
