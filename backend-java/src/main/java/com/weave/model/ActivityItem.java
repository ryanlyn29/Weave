package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "activity_items")
public class ActivityItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id")
    private ExtractedEntity entity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private Thread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id")
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double importance = 0.0;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant timestamp;

    public ActivityItem() {
    }

    public ActivityItem(UUID id, ActivityType type, ExtractedEntity entity, Thread thread, Message message, User user, String description, Double importance, Instant timestamp) {
        this.id = id;
        this.type = type;
        this.entity = entity;
        this.thread = thread;
        this.message = message;
        this.user = user;
        this.description = description;
        this.importance = importance;
        this.timestamp = timestamp;
    }

    public UUID getId() {
        return id;
    }

    public ActivityType getType() {
        return type;
    }

    public ExtractedEntity getEntity() {
        return entity;
    }

    public Thread getThread() {
        return thread;
    }

    public Message getMessage() {
        return message;
    }

    public User getUser() {
        return user;
    }

    public String getDescription() {
        return description;
    }

    public Double getImportance() {
        return importance;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public enum ActivityType {
        DECISION_MADE, ITEM_RESOLVED, MEMORY_RESURFACED, NUDGE_SENT
    }
}
