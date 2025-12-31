package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "threads")
public class Thread {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    private String title;

    @Column(nullable = false)
    private Instant lastActivity;

    @Column(nullable = false)
    private Integer unreadCount = 0;

    @Column(nullable = false)
    private Double importanceScore = 0.0;

    private String mlSummary;

    @Column(nullable = false)
    private Integer unresolvedCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ThreadStatus status = ThreadStatus.OPEN;

    @Version
    private Long version;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public Thread() {
    }

    public Thread(UUID id, Group group, String title, Instant lastActivity, Integer unreadCount, Double importanceScore, String mlSummary, Integer unresolvedCount, Long version, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.group = group;
        this.title = title;
        this.lastActivity = lastActivity;
        this.unreadCount = unreadCount;
        this.importanceScore = importanceScore;
        this.mlSummary = mlSummary;
        this.unresolvedCount = unresolvedCount;
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public Group getGroup() {
        return group;
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

    public Long getVersion() {
        return version;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setLastActivity(Instant lastActivity) {
        this.lastActivity = lastActivity;
    }

    public void setUnreadCount(Integer unreadCount) {
        this.unreadCount = unreadCount;
    }

    public void setImportanceScore(Double importanceScore) {
        this.importanceScore = importanceScore;
    }

    public void setUnresolvedCount(Integer unresolvedCount) {
        this.unresolvedCount = unresolvedCount;
    }

    public ThreadStatus getStatus() {
        return status;
    }

    public void setStatus(ThreadStatus status) {
        this.status = status;
    }

    public enum ThreadStatus {
        OPEN, BLOCKED, RESOLVED, ARCHIVED
    }
}
