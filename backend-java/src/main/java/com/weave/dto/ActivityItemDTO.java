package com.weave.dto;

import java.time.Instant;
import java.util.UUID;

public class ActivityItemDTO {
    private final UUID id;
    private final String type;
    private final UUID entityId;
    private final UUID threadId;
    private final UUID messageId;
    private final UUID userId;
    private final String description;
    private final Instant timestamp;
    private final Double importance;

    public ActivityItemDTO(UUID id, String type, UUID entityId, UUID threadId, UUID messageId, UUID userId, String description, Instant timestamp, Double importance) {
        this.id = id;
        this.type = type;
        this.entityId = entityId;
        this.threadId = threadId;
        this.messageId = messageId;
        this.userId = userId;
        this.description = description;
        this.timestamp = timestamp;
        this.importance = importance;
    }

    public UUID getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public UUID getThreadId() {
        return threadId;
    }

    public UUID getMessageId() {
        return messageId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getDescription() {
        return description;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Double getImportance() {
        return importance;
    }
}
