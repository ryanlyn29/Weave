package com.weave.controller;

import com.weave.dto.CreateEntityLinkRequest;
import com.weave.dto.EntityRelationshipDTO;
import com.weave.model.EntityRelationship;
import com.weave.service.EntityLinkService;
import com.weave.service.EntityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/entities")
public class EntityLinkController {
    private final EntityLinkService entityLinkService;
    private final EntityService entityService;

    public EntityLinkController(EntityLinkService entityLinkService, EntityService entityService) {
        this.entityLinkService = entityLinkService;
        this.entityService = entityService;
    }

    /**
     * Create a relationship between entities
     * POST /v1/entities/{sourceId}/link
     */
    @PostMapping("/{sourceId}/link")
    public ResponseEntity<EntityRelationshipDTO> createLink(
            @PathVariable UUID sourceId,
            @Valid @RequestBody CreateEntityLinkRequest request) {
        try {
            EntityRelationship.LinkType linkType = EntityRelationship.LinkType.valueOf(request.getLinkType().toUpperCase());
            EntityRelationship relationship = entityLinkService.createRelationship(sourceId, request.getTargetEntityId(), linkType);
            return ResponseEntity.ok(toDTO(relationship));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete a relationship between entities
     * DELETE /v1/entities/{sourceId}/link/{targetId}?linkType=BLOCKS
     */
    @DeleteMapping("/{sourceId}/link/{targetId}")
    public ResponseEntity<Void> deleteLink(
            @PathVariable UUID sourceId,
            @PathVariable UUID targetId,
            @RequestParam String linkType) {
        try {
            EntityRelationship.LinkType linkTypeEnum = EntityRelationship.LinkType.valueOf(linkType.toUpperCase());
            entityLinkService.deleteRelationship(sourceId, targetId, linkTypeEnum);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all relationships for an entity
     * GET /v1/entities/{entityId}/relationships
     */
    @GetMapping("/{entityId}/relationships")
    public ResponseEntity<List<EntityRelationshipDTO>> getRelationships(@PathVariable UUID entityId) {
        List<EntityRelationship> relationships = entityLinkService.getEntityRelationships(entityId);
        List<EntityRelationshipDTO> dtos = relationships.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get outgoing relationships for an entity
     * GET /v1/entities/{entityId}/relationships/outgoing
     */
    @GetMapping("/{entityId}/relationships/outgoing")
    public ResponseEntity<List<EntityRelationshipDTO>> getOutgoingRelationships(@PathVariable UUID entityId) {
        List<EntityRelationship> relationships = entityLinkService.getOutgoingRelationships(entityId);
        List<EntityRelationshipDTO> dtos = relationships.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get incoming relationships for an entity
     * GET /v1/entities/{entityId}/relationships/incoming
     */
    @GetMapping("/{entityId}/relationships/incoming")
    public ResponseEntity<List<EntityRelationshipDTO>> getIncomingRelationships(@PathVariable UUID entityId) {
        List<EntityRelationship> relationships = entityLinkService.getIncomingRelationships(entityId);
        List<EntityRelationshipDTO> dtos = relationships.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private EntityRelationshipDTO toDTO(EntityRelationship relationship) {
        return new EntityRelationshipDTO(
            relationship.getId(),
            relationship.getSourceEntity().getId(),
            relationship.getTargetEntity().getId(),
            relationship.getLinkType().name(),
            entityService.toDTO(relationship.getSourceEntity()),
            entityService.toDTO(relationship.getTargetEntity())
        );
    }
}
