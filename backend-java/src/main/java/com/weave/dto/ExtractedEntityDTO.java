package com.weave.dto;

import java.time.Instant;
import java.util.UUID;

public class ExtractedEntityDTO {
    private final UUID id;
    private final String type;
    private final String title;
    private final String description;
    private final String status;
    private final UUID ownerId;
    private final UUID threadId;
    private final UUID messageId;
    private final Instant createdAt;
    private final Instant updatedAt;
    private final UUID lastTouchedBy;
    private final EntityMetadataDTO metadata;
    private final Double importanceScore;
    private final String voiceSummaryUrl;

    public ExtractedEntityDTO(UUID id, String type, String title, String description, String status, UUID ownerId, UUID threadId, UUID messageId, Instant createdAt, Instant updatedAt, UUID lastTouchedBy, EntityMetadataDTO metadata, Double importanceScore, String voiceSummaryUrl) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.status = status;
        this.ownerId = ownerId;
        this.threadId = threadId;
        this.messageId = messageId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastTouchedBy = lastTouchedBy;
        this.metadata = metadata;
        this.importanceScore = importanceScore;
        this.voiceSummaryUrl = voiceSummaryUrl;
    }

    public UUID getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public UUID getThreadId() {
        return threadId;
    }

    public UUID getMessageId() {
        return messageId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public UUID getLastTouchedBy() {
        return lastTouchedBy;
    }

    public EntityMetadataDTO getMetadata() {
        return metadata;
    }

    public Double getImportanceScore() {
        return importanceScore;
    }

    public String getVoiceSummaryUrl() {
        return voiceSummaryUrl;
    }
}
