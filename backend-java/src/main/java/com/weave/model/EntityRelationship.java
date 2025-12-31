package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Represents a relationship between two ExtractedEntity objects.
 * Supports bidirectional relationships and different relationship types.
 */
@Entity
@Table(name = "entity_relationships", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"source_entity_id", "target_entity_id", "link_type"})
})
public class EntityRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_entity_id", nullable = false)
    private ExtractedEntity sourceEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_entity_id", nullable = false)
    private ExtractedEntity targetEntity;

    @Enumerated(EnumType.STRING)
    @Column(name = "link_type", nullable = false, length = 50)
    private LinkType linkType;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public EntityRelationship() {
    }

    public EntityRelationship(ExtractedEntity sourceEntity, ExtractedEntity targetEntity, LinkType linkType) {
        this.sourceEntity = sourceEntity;
        this.targetEntity = targetEntity;
        this.linkType = linkType;
    }

    public UUID getId() {
        return id;
    }

    public ExtractedEntity getSourceEntity() {
        return sourceEntity;
    }

    public void setSourceEntity(ExtractedEntity sourceEntity) {
        this.sourceEntity = sourceEntity;
    }

    public ExtractedEntity getTargetEntity() {
        return targetEntity;
    }

    public void setTargetEntity(ExtractedEntity targetEntity) {
        this.targetEntity = targetEntity;
    }

    public LinkType getLinkType() {
        return linkType;
    }

    public void setLinkType(LinkType linkType) {
        this.linkType = linkType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    /**
     * Relationship types between entities
     */
    public enum LinkType {
        BLOCKS,           // Source blocks target (e.g., "Task A blocks Task B")
        RELATES_TO,       // General relation (bidirectional)
        CHILD_OF,         // Source is a child of target (e.g., subtask)
        DEPENDS_ON,       // Source depends on target
        REFERENCED_IN,    // Source is referenced in target
        SIMILAR_TO        // Source is similar to target
    }
}
