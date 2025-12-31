package com.weave.dto;

import java.time.Instant;
import java.util.UUID;

public class NotificationDTO {
    private final UUID id;
    private final String type;
    private final String title;
    private final String message;
    private final UUID threadId;
    private final UUID entityId;
    private final Instant timestamp;
    private final Boolean read;

    public NotificationDTO(UUID id, String type, String title, String message, UUID threadId, UUID entityId, Instant timestamp, Boolean read) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.message = message;
        this.threadId = threadId;
        this.entityId = entityId;
        this.timestamp = timestamp;
        this.read = read;
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

    public String getMessage() {
        return message;
    }

    public UUID getThreadId() {
        return threadId;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Boolean getRead() {
        return read;
    }
}
