package com.weave.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateEntityLinkRequest {
    @NotNull
    private UUID targetEntityId;

    @NotNull
    private String linkType; // EntityRelationship.LinkType enum as string

    public CreateEntityLinkRequest() {
    }

    public CreateEntityLinkRequest(UUID targetEntityId, String linkType) {
        this.targetEntityId = targetEntityId;
        this.linkType = linkType;
    }

    public UUID getTargetEntityId() {
        return targetEntityId;
    }

    public void setTargetEntityId(UUID targetEntityId) {
        this.targetEntityId = targetEntityId;
    }

    public String getLinkType() {
        return linkType;
    }

    public void setLinkType(String linkType) {
        this.linkType = linkType;
    }
}
