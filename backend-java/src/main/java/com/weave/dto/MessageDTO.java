package com.weave.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class MessageDTO {
    private final UUID id;
    private final UUID threadId;
    private final UUID senderId;
    private final String type;
    private final String content;
    private final String audioUrl;
    private final List<Double> waveform;
    private final List<FileAttachmentDTO> fileAttachments;
    private final Instant timestamp;
    private final List<UUID> entities;

    public MessageDTO(UUID id, UUID threadId, UUID senderId, String type, String content, String audioUrl, List<Double> waveform, List<FileAttachmentDTO> fileAttachments, Instant timestamp, List<UUID> entities) {
        this.id = id;
        this.threadId = threadId;
        this.senderId = senderId;
        this.type = type;
        this.content = content;
        this.audioUrl = audioUrl;
        this.waveform = waveform;
        this.fileAttachments = fileAttachments;
        this.timestamp = timestamp;
        this.entities = entities;
    }

    public UUID getId() {
        return id;
    }

    public UUID getThreadId() {
        return threadId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public String getType() {
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

    public List<FileAttachmentDTO> getFileAttachments() {
        return fileAttachments;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public List<UUID> getEntities() {
        return entities;
    }
}
