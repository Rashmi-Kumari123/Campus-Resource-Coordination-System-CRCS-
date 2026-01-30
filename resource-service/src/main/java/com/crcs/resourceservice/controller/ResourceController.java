package com.crcs.resourceservice.controller;

import com.crcs.resourceservice.dto.request.CreateResourceRequestDTO;
import com.crcs.resourceservice.dto.request.UpdateResourceRequestDTO;
import com.crcs.resourceservice.dto.response.ApiResponseDTO;
import com.crcs.resourceservice.dto.response.PageResponseDTO;
import com.crcs.resourceservice.dto.response.ResourceResponseDTO;
import com.crcs.resourceservice.model.Resource;
import com.crcs.resourceservice.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/resources")
@Tag(name = "Resource Management", description = "APIs for managing campus resources")
public class ResourceController {
    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @Operation(summary = "Create a new resource", description = "Create a new resource (room, lab, or equipment)")
    @PostMapping
    public ResponseEntity<?> createResource(@Valid @RequestBody CreateResourceRequestDTO request) {
        ResourceResponseDTO resource = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    @Operation(summary = "Get resource by ID", description = "Retrieve a specific resource by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getResourceById(@PathVariable("id") String id) {
        Optional<ResourceResponseDTO> resource = resourceService.getResourceById(id);
        return resource.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get all resources", description = "Retrieve all resources with pagination")
    @GetMapping
    public ResponseEntity<PageResponseDTO<ResourceResponseDTO>> getAllResources(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponseDTO<ResourceResponseDTO> resources = resourceService.getAllResources(page, size);
        return ResponseEntity.ok(resources);
    }

    @Operation(summary = "Get resources by type", description = "Retrieve resources filtered by type (ROOM, LAB, HALL, EQUIPMENT, CAFETERIA, LIBRARY, PARKING, SPORTS)")
    @GetMapping("/type/{type}")
    public ResponseEntity<PageResponseDTO<ResourceResponseDTO>> getResourcesByType(
            @PathVariable("type") Resource.ResourceType type,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponseDTO<ResourceResponseDTO> resources = resourceService.getResourcesByType(type, page, size);
        return ResponseEntity.ok(resources);
    }

    @Operation(summary = "Get available resources", description = "Retrieve all available resources")
    @GetMapping("/available")
    public ResponseEntity<PageResponseDTO<ResourceResponseDTO>> getAvailableResources(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponseDTO<ResourceResponseDTO> resources = resourceService.getAvailableResources(page, size);
        return ResponseEntity.ok(resources);
    }

    @Operation(summary = "Update resource", description = "Update an existing resource")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable("id") String id,
                                           @RequestBody UpdateResourceRequestDTO request) {
        Optional<ResourceResponseDTO> updated = resourceService.updateResource(id, request);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update resource status", description = "Update the status of a resource")
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateResourceStatus(@PathVariable("id") String id,
                                                  @RequestParam("status") Resource.ResourceStatus status) {
        boolean updated = resourceService.updateResourceStatus(id, status);
        if (updated) {
            return ResponseEntity.ok(new ApiResponseDTO("Resource status updated successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete resource", description = "Delete a resource by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable("id") String id) {
        boolean deleted = resourceService.deleteResource(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponseDTO("Resource deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get resources by owner", description = "Retrieve all resources owned by a specific user")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getResourcesByOwner(@PathVariable("ownerId") String ownerId) {
        return ResponseEntity.ok(resourceService.getResourcesByOwner(ownerId));
    }
}
