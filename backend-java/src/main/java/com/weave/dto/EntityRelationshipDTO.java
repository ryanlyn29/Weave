package com.weave.dto;

import com.weave.model.EntityRelationship;

import java.util.UUID;

public class EntityRelationshipDTO {
    private final UUID id;
    private final UUID sourceEntityId;
    private final UUID targetEntityId;
    private final String linkType;
    private final ExtractedEntityDTO sourceEntity;
    private final ExtractedEntityDTO targetEntity;

    public EntityRelationshipDTO(UUID id, UUID sourceEntityId, UUID targetEntityId, String linkType, ExtractedEntityDTO sourceEntity, ExtractedEntityDTO targetEntity) {
        this.id = id;
        this.sourceEntityId = sourceEntityId;
        this.targetEntityId = targetEntityId;
        this.linkType = linkType;
        this.sourceEntity = sourceEntity;
        this.targetEntity = targetEntity;
    }

    public UUID getId() {
        return id;
    }

    public UUID getSourceEntityId() {
        return sourceEntityId;
    }

    public UUID getTargetEntityId() {
        return targetEntityId;
    }

    public String getLinkType() {
        return linkType;
    }

    public ExtractedEntityDTO getSourceEntity() {
        return sourceEntity;
    }

    public ExtractedEntityDTO getTargetEntity() {
        return targetEntity;
    }
}
