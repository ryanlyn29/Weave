package com.weave.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SendMessageRequest {
    @NotNull
    private UUID threadId;

    @NotBlank
    private String type;

    private String content;

    private String audioUrl;

    private List<FileAttachmentDTO> fileAttachments;

    private List<String> tags;

    private String context;

    private String commentary;

    private CalendarEventDTO calendarEvent;

    public SendMessageRequest() {
    }

    public SendMessageRequest(UUID threadId, String type, String content, String audioUrl, List<String> tags, String context, String commentary, CalendarEventDTO calendarEvent) {
        this.threadId = threadId;
        this.type = type;
        this.content = content;
        this.audioUrl = audioUrl;
        this.tags = tags;
        this.context = context;
        this.commentary = commentary;
        this.calendarEvent = calendarEvent;
    }

    public UUID getThreadId() {
        return threadId;
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

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public List<FileAttachmentDTO> getFileAttachments() {
        return fileAttachments;
    }

    public void setFileAttachments(List<FileAttachmentDTO> fileAttachments) {
        this.fileAttachments = fileAttachments;
    }

    public List<String> getTags() {
        return tags;
    }

    public String getContext() {
        return context;
    }

    public String getCommentary() {
        return commentary;
    }

    public CalendarEventDTO getCalendarEvent() {
        return calendarEvent;
    }
}
