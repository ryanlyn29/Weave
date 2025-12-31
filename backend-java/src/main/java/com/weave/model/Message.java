package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private Thread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String audioUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Double> waveform;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<FileAttachment> fileAttachments;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant timestamp;

    @ManyToMany
    @JoinTable(
        name = "message_entities",
        joinColumns = @JoinColumn(name = "message_id"),
        inverseJoinColumns = @JoinColumn(name = "entity_id")
    )
    private List<ExtractedEntity> entities = new ArrayList<>();

    @Version
    private Long version;

    public Message() {
    }

    public Message(UUID id, Thread thread, User sender, MessageType type, String content, String audioUrl, List<Double> waveform, Instant timestamp, List<ExtractedEntity> entities, Long version) {
        this.id = id;
        this.thread = thread;
        this.sender = sender;
        this.type = type;
        this.content = content;
        this.audioUrl = audioUrl;
        this.waveform = waveform;
        this.timestamp = timestamp;
        this.entities = entities != null ? entities : new ArrayList<>();
        this.version = version;
    }

    public UUID getId() {
        return id;
    }

    public Thread getThread() {
        return thread;
    }

    public User getSender() {
        return sender;
    }

    public MessageType getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public List<Double> getWaveform() {
        return waveform;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public List<ExtractedEntity> getEntities() {
        return entities;
    }

    public Long getVersion() {
        return version;
    }

    public void setThread(Thread thread) {
        this.thread = thread;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public void setWaveform(List<Double> waveform) {
        this.waveform = waveform;
    }

    public List<FileAttachment> getFileAttachments() {
        return fileAttachments;
    }

    public void setFileAttachments(List<FileAttachment> fileAttachments) {
        this.fileAttachments = fileAttachments;
    }

    public enum MessageType {
        TEXT, VOICE
    }
}
