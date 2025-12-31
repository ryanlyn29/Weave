package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "extracted_entities")
public class ExtractedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityStatus status = EntityStatus.PROPOSED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private Thread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private EntityMetadata metadata;

    @Column(nullable = false)
    private Double importanceScore = 0.0;

    private String voiceSummaryUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_touched_by_id")
    private User lastTouchedBy;

    @OneToMany(mappedBy = "sourceEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EntityRelationship> outgoingRelationships = new ArrayList<>();

    @OneToMany(mappedBy = "targetEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EntityRelationship> incomingRelationships = new ArrayList<>();

    @Version
    private Long version;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public ExtractedEntity() {
    }

    public ExtractedEntity(UUID id, EntityType type, String title, String description, EntityStatus status, User owner, Thread thread, Message message, EntityMetadata metadata, Double importanceScore, String voiceSummaryUrl, User lastTouchedBy, Long version, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.status = status;
        this.owner = owner;
        this.thread = thread;
        this.message = message;
        this.metadata = metadata;
        this.importanceScore = importanceScore;
        this.voiceSummaryUrl = voiceSummaryUrl;
        this.lastTouchedBy = lastTouchedBy;
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public EntityType getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public EntityStatus getStatus() {
        return status;
    }

    public User getOwner() {
        return owner;
    }

    public Thread getThread() {
        return thread;
    }

    public Message getMessage() {
        return message;
    }

    public EntityMetadata getMetadata() {
        return metadata;
    }

    public Double getImportanceScore() {
        return importanceScore;
    }

    public String getVoiceSummaryUrl() {
        return voiceSummaryUrl;
    }

    public User getLastTouchedBy() {
        return lastTouchedBy;
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

    public void setType(EntityType type) {
        this.type = type;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(EntityStatus status) {
        this.status = status;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void setThread(Thread thread) {
        this.thread = thread;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public void setImportanceScore(Double importanceScore) {
        this.importanceScore = importanceScore;
    }

    public void setLastTouchedBy(User lastTouchedBy) {
        this.lastTouchedBy = lastTouchedBy;
    }

    public void setVoiceSummaryUrl(String voiceSummaryUrl) {
        this.voiceSummaryUrl = voiceSummaryUrl;
    }

    public void setMetadata(EntityMetadata metadata) {
        this.metadata = metadata;
    }

    public List<EntityRelationship> getOutgoingRelationships() {
        return outgoingRelationships;
    }

    public void setOutgoingRelationships(List<EntityRelationship> outgoingRelationships) {
        this.outgoingRelationships = outgoingRelationships;
    }

    public List<EntityRelationship> getIncomingRelationships() {
        return incomingRelationships;
    }

    public void setIncomingRelationships(List<EntityRelationship> incomingRelationships) {
        this.incomingRelationships = incomingRelationships;
    }

    public enum EntityType {
        PLAN, DECISION, RECOMMENDATION, PROMISE, MEMORY
    }

    public enum EntityStatus {
        PROPOSED, CONFIRMED, CHANGED, CANCELLED, DONE, PENDING, RESOLVED
    }
}
