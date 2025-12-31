package com.weave.service;

import com.weave.model.EntityRelationship;
import com.weave.model.ExtractedEntity;
import com.weave.repository.EntityRelationshipRepository;
import com.weave.repository.ExtractedEntityRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for managing relationships between entities
 */
@Service
public class EntityLinkService {
    private final EntityRelationshipRepository relationshipRepository;
    private final ExtractedEntityRepository entityRepository;

    public EntityLinkService(EntityRelationshipRepository relationshipRepository, ExtractedEntityRepository entityRepository) {
        this.relationshipRepository = relationshipRepository;
        this.entityRepository = entityRepository;
    }

    /**
     * Create a relationship between two entities
     */
    @Transactional
    public EntityRelationship createRelationship(UUID sourceEntityId, UUID targetEntityId, EntityRelationship.LinkType linkType) {
        // Verify user has access to both entities
        ExtractedEntity sourceEntity = entityRepository.findById(sourceEntityId)
            .orElseThrow(() -> new RuntimeException("Source entity not found: " + sourceEntityId));
        ExtractedEntity targetEntity = entityRepository.findById(targetEntityId)
            .orElseThrow(() -> new RuntimeException("Target entity not found: " + targetEntityId));

        // Verify ownership (user must own both entities)
        var currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        if (!sourceEntity.getOwner().getId().equals(currentUser.getId()) ||
            !targetEntity.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("User does not have permission to link these entities");
        }

        // Check if relationship already exists
        if (relationshipRepository.existsBySourceAndTargetAndType(sourceEntityId, targetEntityId, linkType)) {
            throw new RuntimeException("Relationship already exists between these entities");
        }

        // Create relationship
        EntityRelationship relationship = new EntityRelationship(sourceEntity, targetEntity, linkType);
        return relationshipRepository.save(relationship);
    }

    /**
     * Delete a relationship between two entities
     */
    @Transactional
    public void deleteRelationship(UUID sourceEntityId, UUID targetEntityId, EntityRelationship.LinkType linkType) {
        // Verify user has access
        ExtractedEntity sourceEntity = entityRepository.findById(sourceEntityId)
            .orElseThrow(() -> new RuntimeException("Source entity not found: " + sourceEntityId));

        var currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        if (!sourceEntity.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("User does not have permission to delete this relationship");
        }

        List<EntityRelationship> relationships = relationshipRepository.findBySourceAndTargetAndType(sourceEntityId, targetEntityId, linkType);
        relationshipRepository.deleteAll(relationships);
    }

    /**
     * Get all relationships for an entity (both outgoing and incoming)
     * Note: This method should be called with JOIN FETCH to eagerly load related entities
     */
    @Transactional(readOnly = true)
    public List<EntityRelationship> getEntityRelationships(UUID entityId) {
        // Verify user has access
        ExtractedEntity entity = entityRepository.findById(entityId)
            .orElseThrow(() -> new RuntimeException("Entity not found: " + entityId));

        var currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        if (!entity.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("User does not have permission to view this entity's relationships");
        }

        return relationshipRepository.findByEntityId(entityId);
    }

    /**
     * Get outgoing relationships for an entity
     */
    @Transactional(readOnly = true)
    public List<EntityRelationship> getOutgoingRelationships(UUID entityId) {
        ExtractedEntity entity = entityRepository.findById(entityId)
            .orElseThrow(() -> new RuntimeException("Entity not found: " + entityId));

        var currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        if (!entity.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("User does not have permission to view this entity's relationships");
        }

        return relationshipRepository.findBySourceEntityId(entityId);
    }

    /**
     * Get incoming relationships for an entity
     */
    @Transactional(readOnly = true)
    public List<EntityRelationship> getIncomingRelationships(UUID entityId) {
        ExtractedEntity entity = entityRepository.findById(entityId)
            .orElseThrow(() -> new RuntimeException("Entity not found: " + entityId));

        var currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        if (!entity.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("User does not have permission to view this entity's relationships");
        }

        return relationshipRepository.findByTargetEntityId(entityId);
    }
}
