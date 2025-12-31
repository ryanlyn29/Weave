package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id")
    private Thread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id")
    private ExtractedEntity entity;

    @Column(nullable = false)
    private Boolean read = false;

    private Instant readAt;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    public Notification() {
    }

    public Notification(UUID id, NotificationType type, String title, String message, User user, Thread thread, ExtractedEntity entity, Boolean read, Instant readAt, Instant createdAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.message = message;
        this.user = user;
        this.thread = thread;
        this.entity = entity;
        this.read = read;
        this.readAt = readAt;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public NotificationType getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public User getUser() {
        return user;
    }

    public Thread getThread() {
        return thread;
    }

    public ExtractedEntity getEntity() {
        return entity;
    }

    public Boolean getRead() {
        return read;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }

    public enum NotificationType {
        NUDGE, MEMORY, ENTITY_UPDATE
    }
}
