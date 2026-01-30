package com.crcs.resourceservice.dto.request;

import com.crcs.resourceservice.model.Resource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateResourceRequestDTO {
    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private Resource.ResourceType type;

    private String description;

    private String location;

    private Integer capacity;

    @NotBlank(message = "Owner ID is required")
    private String ownerId;

    private String responsiblePerson;
}
