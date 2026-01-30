package com.crcs.resourceservice.service;

import com.crcs.resourceservice.dto.request.CreateResourceRequestDTO;
import com.crcs.resourceservice.dto.request.UpdateResourceRequestDTO;
import com.crcs.resourceservice.dto.response.PageResponseDTO;
import com.crcs.resourceservice.dto.response.ResourceResponseDTO;
import com.crcs.resourceservice.model.Resource;
import com.crcs.resourceservice.repository.ResourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResourceService {
    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Transactional
    public ResourceResponseDTO createResource(CreateResourceRequestDTO request) {
        Resource resource = Resource.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .status(Resource.ResourceStatus.AVAILABLE)
                .ownerId(request.getOwnerId())
                .responsiblePerson(request.getResponsiblePerson())
                .build();

        resource = resourceRepository.save(resource);
        return mapToResponseDTO(resource);
    }

    public Optional<ResourceResponseDTO> getResourceById(String id) {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }
        return resourceRepository.findById(id)
                .map(this::mapToResponseDTO);
    }

    public PageResponseDTO<ResourceResponseDTO> getAllResources(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resourcePage = resourceRepository.findAll(pageable);
        return mapToPageResponseDTO(resourcePage);
    }

    public PageResponseDTO<ResourceResponseDTO> getResourcesByType(Resource.ResourceType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resourcePage = resourceRepository.findByType(type, pageable);
        return mapToPageResponseDTO(resourcePage);
    }

    public PageResponseDTO<ResourceResponseDTO> getResourcesByStatus(Resource.ResourceStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resourcePage = resourceRepository.findByStatus(status, pageable);
        return mapToPageResponseDTO(resourcePage);
    }

    public PageResponseDTO<ResourceResponseDTO> getAvailableResources(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resourcePage = resourceRepository.findByStatus(Resource.ResourceStatus.AVAILABLE, pageable);
        return mapToPageResponseDTO(resourcePage);
    }

    @Transactional
    public Optional<ResourceResponseDTO> updateResource(String id, UpdateResourceRequestDTO request) {
        return resourceRepository.findById(id)
                .map(resource -> {
                    if (request.getName() != null) resource.setName(request.getName());
                    if (request.getType() != null) resource.setType(request.getType());
                    if (request.getDescription() != null) resource.setDescription(request.getDescription());
                    if (request.getLocation() != null) resource.setLocation(request.getLocation());
                    if (request.getCapacity() != null) resource.setCapacity(request.getCapacity());
                    if (request.getStatus() != null) resource.setStatus(request.getStatus());
                    if (request.getOwnerId() != null) resource.setOwnerId(request.getOwnerId());
                    if (request.getResponsiblePerson() != null) resource.setResponsiblePerson(request.getResponsiblePerson());
                    
                    resource = resourceRepository.save(resource);
                    return mapToResponseDTO(resource);
                });
    }

    @Transactional
    public boolean updateResourceStatus(String id, Resource.ResourceStatus status) {
        return resourceRepository.findById(id)
                .map(resource -> {
                    resource.setStatus(status);
                    resourceRepository.save(resource);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public boolean deleteResource(String id) {
        if (resourceRepository.existsById(id)) {
            resourceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<ResourceResponseDTO> getResourcesByOwner(String ownerId) {
        return resourceRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private ResourceResponseDTO mapToResponseDTO(Resource resource) {
        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .description(resource.getDescription())
                .status(resource.getStatus())
                .location(resource.getLocation())
                .capacity(resource.getCapacity())
                .ownerId(resource.getOwnerId())
                .responsiblePerson(resource.getResponsiblePerson())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }

    private PageResponseDTO<ResourceResponseDTO> mapToPageResponseDTO(Page<Resource> resourcePage) {
        List<ResourceResponseDTO> content = resourcePage.getContent()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                content,
                resourcePage.getNumber(),
                resourcePage.getSize(),
                resourcePage.getTotalElements(),
                resourcePage.getTotalPages(),
                resourcePage.isLast()
        );
    }
}
