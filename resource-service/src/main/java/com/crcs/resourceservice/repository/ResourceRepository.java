package com.crcs.resourceservice.repository;

import com.crcs.resourceservice.model.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, String> {
    Optional<Resource> findById(String id);
    Page<Resource> findByType(Resource.ResourceType type, Pageable pageable);
    Page<Resource> findByStatus(Resource.ResourceStatus status, Pageable pageable);
    Page<Resource> findByTypeAndStatus(Resource.ResourceType type, Resource.ResourceStatus status, Pageable pageable);
    List<Resource> findByOwnerId(String ownerId);
}
