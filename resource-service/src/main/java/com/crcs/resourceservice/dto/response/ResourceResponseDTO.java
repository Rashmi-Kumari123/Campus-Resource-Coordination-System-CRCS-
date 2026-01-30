package com.crcs.resourceservice.dto.response;

import com.crcs.resourceservice.model.Resource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponseDTO {
    private String id;
    private String name;
    private Resource.ResourceType type;
    private String description;
    private Resource.ResourceStatus status;
    private String location;
    private Integer capacity;
    private String ownerId;
    private String responsiblePerson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
