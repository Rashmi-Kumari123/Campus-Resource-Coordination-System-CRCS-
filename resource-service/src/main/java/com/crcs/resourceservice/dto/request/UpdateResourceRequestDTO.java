package com.crcs.resourceservice.dto.request;

import com.crcs.resourceservice.model.Resource;
import lombok.Data;

@Data
public class UpdateResourceRequestDTO {
    private String name;
    private Resource.ResourceType type;
    private String description;
    private String location;
    private Integer capacity;
    private Resource.ResourceStatus status;
    private String ownerId;
    private String responsiblePerson;
}
