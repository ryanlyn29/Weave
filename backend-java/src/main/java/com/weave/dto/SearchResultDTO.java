package com.weave.dto;

import java.time.Instant;
import java.util.UUID;

public class SearchResultDTO {
    private final UUID id;
    private final String type;
    private final String title;
    private final String snippet;
    private final Double confidence;
    private final String whyReturned;
    private final UUID sourceThreadId;
    private final UUID sourceMessageId;
    private final UUID entityId;
    private final Instant timestamp;

    public SearchResultDTO(UUID id, String type, String title, String snippet, Double confidence, String whyReturned, UUID sourceThreadId, UUID sourceMessageId, UUID entityId, Instant timestamp) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.snippet = snippet;
        this.confidence = confidence;
        this.whyReturned = whyReturned;
        this.sourceThreadId = sourceThreadId;
        this.sourceMessageId = sourceMessageId;
        this.entityId = entityId;
        this.timestamp = timestamp;
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

    public String getSnippet() {
        return snippet;
    }

    public Double getConfidence() {
        return confidence;
    }

    public String getWhyReturned() {
        return whyReturned;
    }

    public UUID getSourceThreadId() {
        return sourceThreadId;
    }

    public UUID getSourceMessageId() {
        return sourceMessageId;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
