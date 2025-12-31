package com.weave.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ThreadDTO {
    private final UUID id;
    private final UUID groupId;
    private final List<UUID> participants;
    private final String title;
    private final Instant lastActivity;
    private final Integer unreadCount;
    private final Double importanceScore;
    private final String mlSummary;
    private final Integer unresolvedCount;
    private final String status;

    public ThreadDTO(UUID id, UUID groupId, List<UUID> participants, String title, Instant lastActivity, Integer unreadCount, Double importanceScore, String mlSummary, Integer unresolvedCount, String status) {
        this.id = id;
        this.groupId = groupId;
        this.participants = participants;
        this.title = title;
        this.lastActivity = lastActivity;
        this.unreadCount = unreadCount;
        this.importanceScore = importanceScore;
        this.mlSummary = mlSummary;
        this.unresolvedCount = unresolvedCount;
        this.status = status;
    }

    public UUID getId() {
        return id;
    }

    public UUID getGroupId() {
        return groupId;
    }

    public List<UUID> getParticipants() {
        return participants;
    }

    public String getTitle() {
        return title;
    }

    public Instant getLastActivity() {
        return lastActivity;
    }

    public Integer getUnreadCount() {
        return unreadCount;
    }

    public Double getImportanceScore() {
        return importanceScore;
    }

    public String getMlSummary() {
        return mlSummary;
    }

    public Integer getUnresolvedCount() {
        return unresolvedCount;
    }

    public String getStatus() {
        return status;
    }
}
